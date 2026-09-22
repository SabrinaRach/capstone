import dbConnect from "../../../db/connect.js";
import UserPreference from "../../../db/models/UserPreference.js";
import { authOptions } from "../auth/[...nextauth]";
import { getSessionSafe } from "../../../lib/apiError.js";

const SUPPORTED_LOCALES = ["de", "en"];

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res
      .status(405)
      .json({ code: "METHOD_NOT_ALLOWED", message: "Method not allowed" });
  }

  const session = await getSessionSafe(req, res, authOptions);

  if (!session) {
    return res
      .status(401)
      .json({ code: "NOT_AUTHORIZED", message: "Not authorized" });
  }

  const { locale } = req.body || {};

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return res
      .status(400)
      .json({ code: "INVALID_LOCALE", message: "Invalid locale." });
  }

  try {
    await dbConnect();

    await UserPreference.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { locale } },
      { upsert: true },
    );

    return res.status(200).json({ locale });
  } catch (error) {
    console.error("Locale update error:", error);

    return res.status(500).json({
      code: "GENERIC_ERROR",
      message: "Something went wrong. Please try again.",
    });
  }
}
