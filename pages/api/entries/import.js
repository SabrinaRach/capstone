import Anthropic from "@anthropic-ai/sdk";
import * as cheerio from "cheerio";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_HTML_LENGTH = 2_000_000;
const FETCH_TIMEOUT = 10_000;

const extractionTool = {
  name: "extract_entry",
  description:
    "Extract only information from the website that belongs to the predefined entry fields.",
  input_schema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description:
          "The title of the entry. Return an empty string if it cannot be identified.",
      },
      description: {
        type: "string",
        description:
          "A relevant description or summary. Return an empty string if none can be identified.",
      },
      items: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          "The relevant items, ingredients, materials, components, or things needed for the entry. Return an empty array if none can be identified.",
      },
      steps: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          "The relevant instructions or steps. Return an empty array if none can be identified.",
      },
      notes: {
        type: "string",
        description:
          "Additional relevant notes that do not belong to the other fields. Return an empty string if none can be identified.",
      },
      source: {
        type: "string",
        description:
          "The original website URL. Always return the provided URL.",
      },
    },
    required: ["title", "description", "items", "steps", "notes", "source"],
  },
};

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function cleanHtml(html) {
  const $ = cheerio.load(html);

  $("script, style, noscript, iframe, svg").remove();

  const mainContent =
    $("article").first().text() || $("main").first().text() || $("body").text();

  return mainContent.replace(/\s+/g, " ").trim().slice(0, MAX_HTML_LENGTH);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const { url } = req.body || {};

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      message: "A website URL is required.",
    });
  }

  if (!isValidHttpUrl(url)) {
    return res.status(400).json({
      message: "Please provide a valid website URL.",
    });
  }

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; EntryImporter/1.0)",
      },
    });

    if (!response.ok) {
      return res.status(400).json({
        message: "The website could not be loaded.",
      });
    }

    const html = await response.text();

    if (!html) {
      return res.status(400).json({
        message: "The website did not return any content.",
      });
    }

    const content = cleanHtml(html);

    if (!content) {
      return res.status(400).json({
        message:
          "No readable content was found on the website. Please fill out manually.",
      });
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2000,

      system: `
You extract structured entry data from website content.

Rules:
- Only extract information that is explicitly supported by the provided website content.
- Never invent or guess information.
- Only use the predefined fields.
- Ignore navigation, advertisements, cookie notices, comments, unrelated links, and other irrelevant content.
- If a field cannot be identified, return an empty string or empty array.
- Do not determine or return a category.
- Preserve the meaning of the original information.
- The source field must contain the original URL provided by the application.
      `,

      tools: [extractionTool],

      tool_choice: {
        type: "tool",
        name: "extract_entry",
      },

      messages: [
        {
          role: "user",
          content: `
Extract the relevant entry information from this website.

<source_url>
${url}
</source_url>

<website_content>
${content}
</website_content>
          `,
        },
      ],
    });

    const toolUse = message.content.find((block) => block.type === "tool_use");

    if (!toolUse) {
      throw new Error("Claude did not return structured extraction data.");
    }

    return res.status(200).json({
      success: true,
      data: toolUse.input,
    });
  } catch (error) {
    console.error("Entry import error:", error);

    return res.status(500).json({
      message: "The website could not be processed. Please try again.",
    });
  }
}
