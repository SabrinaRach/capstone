import dbConnect from "../../db/connect.js";
import Entry from "../../db/models/Entry.js";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  if (request.method === "GET") {
    try {
      const entry = await Entry.findById(id);

      if (!entry) {
        return response.status(404).json({ status: "Not Found" });
      }

      return response.status(200).json(entry);
    } catch (error) {
      return response
        .status(400)
        .json({ status: "Invalid request", error: error.message });
    }
  }
}
