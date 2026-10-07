import { authOptions } from "../auth/[...nextauth]";
import { getSessionSafe, sendApiError } from "../../../lib/apiError.js";
import { deleteUserData } from "../../../lib/userAccount.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ code: "METHOD_NOT_ALLOWED", message: "Method not allowed" });
  }

  const session = await getSessionSafe(req, res, authOptions);

  if (!session?.user?.id) {
    return res
      .status(401)
      .json({ code: "NOT_AUTHORIZED", message: "Not authorized" });
  }

  try {
    await deleteUserData(session.user.id);

    return res
      .status(200)
      .json({ code: "ACCOUNT_DELETED", message: "Account deleted." });
  } catch (error) {
    return sendApiError(res, error, "Account deletion error");
  }
}
