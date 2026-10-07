import * as cheerio from "cheerio";

export const MAX_CONTENT_LENGTH = 50_000;
const FETCH_TIMEOUT = 10_000;

const DEFAULT_USER_AGENT = "Mozilla/5.0 (compatible; EntryImporter/1.0)";
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
// Meta platforms only serve server-rendered content (Open Graph tags, embed
// captions) without a login wall to link preview crawlers.
const LINK_PREVIEW_USER_AGENT = "facebookexternalhit/1.1";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", hosts: ["instagram.com", "instagr.am"] },
  { id: "pinterest", name: "Pinterest", hosts: ["pin.it"], pattern: /(^|\.)pinterest\.[a-z.]+$/ },
  { id: "facebook", name: "Facebook", hosts: ["facebook.com", "fb.com", "fb.watch"] },
  { id: "tiktok", name: "TikTok", hosts: ["tiktok.com"] },
  { id: "x", name: "X", hosts: ["x.com", "twitter.com"] },
];

// Thrown for expected failures; the API route forwards code, status and
// params to the client, which translates them via `apiErrors.<code>`.
export class ImportError extends Error {
  constructor(code, message, { status = 400, params } = {}) {
    super(message);
    this.code = code;
    this.status = status;
    this.params = params;
  }
}

function matchesHost(hostname, host) {
  return hostname === host || hostname.endsWith(`.${host}`);
}

export function detectPlatform(url) {
  const hostname = new URL(url).hostname.toLowerCase();

  return (
    PLATFORMS.find(
      (platform) =>
        platform.hosts.some((host) => matchesHost(hostname, host)) ||
        platform.pattern?.test(hostname),
    ) || null
  );
}

function notAccessible(platform) {
  return new ImportError(
    "IMPORT_SOURCE_NOT_ACCESSIBLE",
    `The ${platform.name} content could not be accessed.`,
    { params: { platform: platform.name } },
  );
}

function noContent(platform) {
  return new ImportError(
    "IMPORT_SOURCE_NO_CONTENT",
    `No usable text was found in the ${platform.name} post.`,
    { params: { platform: platform.name } },
  );
}

function unsupportedUrl(platform) {
  return new ImportError(
    "IMPORT_SOURCE_UNSUPPORTED_URL",
    `This ${platform.name} link is not supported. Please use a link to a single post.`,
    { params: { platform: platform.name } },
  );
}

async function fetchFromPlatform(platform, url, userAgent = BROWSER_USER_AGENT) {
  let response;

  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      headers: {
        "User-Agent": userAgent,
        "Accept-Language": "de,en;q=0.8",
      },
    });
  } catch {
    throw notAccessible(platform);
  }

  if (!response.ok) {
    throw notAccessible(platform);
  }

  return response;
}

function normalizeText(text) {
  return (text || "")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

// Keeps line breaks, which social media captions use to separate ingredients
// and steps.
function textWithLineBreaks($, element) {
  $(element).find("br").replaceWith("\n");
  $(element).find("p, li").each((_, child) => {
    $(child).append("\n");
  });

  return normalizeText($(element).text());
}

function getMeta($, name) {
  return normalizeText(
    $(`meta[property="${name}"]`).attr("content") ||
      $(`meta[name="${name}"]`).attr("content"),
  );
}

function buildContent(sections) {
  return sections
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}:\n${value}`)
    .join("\n\n")
    .slice(0, MAX_CONTENT_LENGTH);
}

function cleanHtml(html) {
  const $ = cheerio.load(html);

  $("style, noscript, iframe, svg").remove();

  $("script").each((_, element) => {
    if ($(element).html()?.length > 100_000) {
      $(element).remove();
    }
  });

  const mainContent =
    $("main").first().text() || $("article").first().text() || $("body").text();

  return mainContent.replace(/\s+/g, " ").trim().slice(0, MAX_CONTENT_LENGTH);
}

async function fetchWebsiteContent(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
    headers: {
      "User-Agent": DEFAULT_USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new ImportError(
      "IMPORT_LOAD_FAILED",
      "The website could not be loaded.",
    );
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_CONTENT_LENGTH) {
    throw new ImportError("IMPORT_TOO_LARGE", "The website is too large.");
  }

  const html = await response.text();

  if (!html) {
    throw new ImportError(
      "IMPORT_NO_CONTENT",
      "The website did not return any content.",
    );
  }

  const content = cleanHtml(html);

  if (!content) {
    throw new ImportError(
      "IMPORT_NO_READABLE_CONTENT",
      "No readable content was found on the website. Please fill out manually.",
    );
  }

  return content;
}

async function fetchInstagramContent(platform, url) {
  const shortcode = new URL(url).pathname.match(
    /\/(?:p|reels?|tv)\/([A-Za-z0-9_-]+)/,
  )?.[1];

  if (!shortcode) {
    throw unsupportedUrl(platform);
  }

  // The public embed page contains the caption without requiring a login.
  const response = await fetchFromPlatform(
    platform,
    `https://www.instagram.com/p/${shortcode}/embed/captioned/`,
    LINK_PREVIEW_USER_AGENT,
  );
  const $ = cheerio.load(await response.text());

  const caption = $(".Caption").first();

  if (caption.length === 0) {
    throw notAccessible(platform);
  }

  const author = normalizeText(caption.find(".CaptionUsername").first().text());
  caption.find(".CaptionUsername, .CaptionComments").remove();
  const text = textWithLineBreaks($, caption);

  if (!text) {
    throw noContent(platform);
  }

  return buildContent([
    ["Author", author],
    ["Caption", text],
  ]);
}

async function fetchTikTokContent(platform, url) {
  const response = await fetchFromPlatform(
    platform,
    `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
  );
  const data = await response.json().catch(() => null);

  if (!data || data.code || !data.html) {
    throw notAccessible(platform);
  }

  const caption = normalizeText(data.title);

  if (!caption) {
    throw noContent(platform);
  }

  return buildContent([
    ["Author", data.author_name],
    ["Caption", caption],
  ]);
}

async function fetchXContent(platform, url) {
  if (!/\/status(?:es)?\/\d+/.test(new URL(url).pathname)) {
    throw unsupportedUrl(platform);
  }

  const response = await fetchFromPlatform(
    platform,
    `https://publish.twitter.com/oembed?omit_script=true&url=${encodeURIComponent(url)}`,
  );
  const data = await response.json().catch(() => null);

  if (!data?.html) {
    throw notAccessible(platform);
  }

  const $ = cheerio.load(data.html);
  const text = textWithLineBreaks($, $("blockquote p").first());

  if (!text) {
    throw noContent(platform);
  }

  return buildContent([
    ["Author", data.author_name],
    ["Post", text],
  ]);
}

async function fetchPinterestContent(platform, url) {
  // Follows pin.it short links to the actual pin page.
  const response = await fetchFromPlatform(platform, url);

  if (!new URL(response.url).pathname.includes("/pin/")) {
    throw unsupportedUrl(platform);
  }

  const $ = cheerio.load(await response.text());
  const title = getMeta($, "og:title");
  const description = getMeta($, "og:description") || getMeta($, "description");

  if (!title && !description) {
    throw notAccessible(platform);
  }

  // Pins often only contain a short teaser; the full content usually lives on
  // the website the pin links to. If that page can't be loaded, the pin's own
  // text is still used.
  const linkedUrl = getMeta($, "og:see_also");
  let linkedContent = "";

  if (linkedUrl && /^https?:\/\//.test(linkedUrl) && !detectPlatform(linkedUrl)) {
    try {
      linkedContent = await fetchWebsiteContent(linkedUrl);
    } catch {
      linkedContent = "";
    }
  }

  return buildContent([
    ["Pin title", title],
    ["Pin description", description],
    ["Linked website", linkedUrl],
    ["Linked website content", linkedContent],
  ]);
}

async function fetchFacebookContent(platform, url) {
  const response = await fetchFromPlatform(platform, url, LINK_PREVIEW_USER_AGENT);

  if (/\/login/.test(new URL(response.url).pathname)) {
    throw notAccessible(platform);
  }

  const $ = cheerio.load(await response.text());
  const title = getMeta($, "og:title");
  const description = getMeta($, "og:description") || getMeta($, "description");

  if (!description) {
    throw title ? noContent(platform) : notAccessible(platform);
  }

  return buildContent([
    ["Title", title],
    ["Post", description],
  ]);
}

const PLATFORM_FETCHERS = {
  instagram: fetchInstagramContent,
  pinterest: fetchPinterestContent,
  facebook: fetchFacebookContent,
  tiktok: fetchTikTokContent,
  x: fetchXContent,
};

// Returns the readable text of a website or social media post, ready to be
// passed to the AI extraction.
export async function fetchSourceContent(url) {
  const platform = detectPlatform(url);

  if (!platform) {
    return { sourceType: "website", content: await fetchWebsiteContent(url) };
  }

  const content = await PLATFORM_FETCHERS[platform.id](platform, url);

  return { sourceType: `${platform.name} post`, content };
}
