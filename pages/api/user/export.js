import { authOptions } from "../auth/[...nextauth]";
import { getSessionSafe, sendApiError } from "../../../lib/apiError.js";
import { exportUserData } from "../../../lib/userAccount.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
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
    const data = await exportUserData(session.user.id);
    const date = data.exportedAt.slice(0, 10);

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="account-data-${date}.json"`,
    );
    res.setHeader("Cache-Control", "no-store");

    return res.status(200).send(JSON.stringify(data, null, 2));
  } catch (error) {
    return sendApiError(res, error, "User data export error");
  }
}
