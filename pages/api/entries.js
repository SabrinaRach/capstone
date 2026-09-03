import dbConnect from "../../db/connect.js";
import Entry from "../../db/models/Entry.js";

//To test if the connection is working, I will create a new entry in the database when this API route is called. This is just for testing purposes and will be removed/adjusted later.
export default async function handler(request, response) {
  try {
    await dbConnect();

    const entry = new Entry({
      title: "Test",
      category: "A",
      steps: ["Test Schritt"],
      items: ["Test Item"],
    });

    await entry.save();

    return response.status(201).json({
      success: true,
      entry,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
