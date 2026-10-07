import Anthropic from "@anthropic-ai/sdk";
import Category from "../../../db/models/Category.js";
import dbConnect from "../../../db/connect.js";
import { authOptions } from "../auth/[...nextauth]";
import { getSessionSafe } from "../../../lib/apiError.js";
import { fetchSourceContent, ImportError } from "../../../lib/importSources.js";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function createExtractionTool(categories) {
  return {
    name: "extract_entry",
    description:
      "Extract only information from the source content that belongs to the predefined entry fields.",
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
        category: {
          type: "string",
          enum: categories.map((category) => category._id.toString()),
          description:
            "The ID of the default category that best matches the source content.",
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
            "The original source URL. Always return the provided URL.",
        },
      },
      required: [
        "title",
        "description",
        "category",
        "items",
        "steps",
        "notes",
        "source",
      ],
    },
  };
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      code: "METHOD_NOT_ALLOWED",
      message: "Method not allowed",
    });
  }

  const session = await getSessionSafe(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({
      code: "NOT_AUTHORIZED",
      message: "Not authorized",
    });
  }

  const { url } = req.body || {};

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      code: "IMPORT_URL_REQUIRED",
      message: "A URL is required.",
    });
  }

  if (!isValidHttpUrl(url)) {
    return res.status(400).json({
      code: "IMPORT_INVALID_URL",
      message: "Please provide a valid URL.",
    });
  }

  try {
    const { sourceType, content } = await fetchSourceContent(url);

    await dbConnect();

    const categories = await Category.find({ isSystem: true })
      .select("_id name slug")
      .lean();

    if (categories.length === 0) {
      return res.status(500).json({
        code: "IMPORT_NO_DEFAULT_CATEGORY",
        message: "No default categories are available.",
      });
    }

    const categoryOptions = categories
      .map(
        (category) =>
          `ID: ${category._id}\nName: ${category.name}\nSlug: ${category.slug}`,
      )
      .join("\n\n");

    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2000,

      system: `
You extract structured entry data from the content of a website or a social media post.

Rules:
- Only extract information that is explicitly supported by the provided source content.
- Never invent or guess information.
- Only use the predefined fields.
- Ignore navigation, advertisements, cookie notices, comments, unrelated links, and other irrelevant content.
- For social media posts, ignore hashtags, @mentions, emojis used as decoration, like/view counts, and calls to action such as "follow for more" or "link in bio".
- If a social media post has no explicit title, use a short, descriptive title based only on what the post is about.
- If a social media post contains a list of items or steps in running text, split it into the items and steps fields.
- For the steps field, return each step without its original numbering.
- If a field cannot be identified, return an empty string or empty array.
- Choose the single default category that best matches the source content.
- Only choose from the provided category IDs.
- Never invent a category.
- Return the category ID, not the category name.
- Preserve the meaning of the original information.
- The source field must contain the original URL provided by the application.
      `,

      tools: [createExtractionTool(categories)],

      tool_choice: {
        type: "tool",
        name: "extract_entry",
      },

      messages: [
        {
          role: "user",
          content: `
Extract the relevant entry information from this source.

<source_type>
${sourceType}
</source_type>

<source_url>
${url}
</source_url>

<available_categories>
${categoryOptions}
</available_categories>

<source_content>
${content}
</source_content>
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
    if (error instanceof ImportError) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        params: error.params,
      });
    }

    console.error("Entry import error:", error);

    return res.status(500).json({
      code: "IMPORT_PROCESS_FAILED",
      message: "The content could not be processed. Please try again.",
    });
  }
}
