import { getServerSession } from "next-auth/next";

// Resolves the current session without letting a NextAuth/adapter failure
// (e.g. a broken DB connection, a malformed/expired token that fails to
// decode) crash the request or page render. Any failure here is treated the
// same as "no session", so callers can keep using their existing
// `if (!session)` guard.
export async function getSessionSafe(req, res, authOptions) {
  try {
    return await getServerSession(req, res, authOptions);
  } catch (error) {
    console.error("Session check failed:", error);
    return null;
  }
}

function firstValidationMessage(error) {
  const firstKey = Object.keys(error.errors || {})[0];
  return error.errors?.[firstKey]?.message || "Invalid input.";
}

// Translates a thrown error from an API route handler into a safe,
// user-facing response. Expected Mongoose/MongoDB errors are mapped to a
// specific 4xx status and message; anything else is logged server-side and
// reported as a generic 500 so raw driver/library errors never reach the
// client.
export function sendApiError(res, error, context) {
  console.error(context ? `${context}:` : "API error:", error);

  if (error?.name === "ValidationError") {
    return res.status(400).json({ message: firstValidationMessage(error) });
  }

  if (error?.code === 11000) {
    return res.status(409).json({ message: "This already exists." });
  }

  if (error?.name === "CastError") {
    return res.status(400).json({ message: "Invalid id." });
  }

  return res
    .status(500)
    .json({ message: "Something went wrong. Please try again." });
}
