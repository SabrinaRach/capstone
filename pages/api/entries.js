
import dbConnect from "../../db/connect.js";
import Entry from "../../db/models/Entry.js";

export default async function handler(request, response) {
  console.log("1 - API");

  try {
    await dbConnect();
    console.log("2 - DB");

    const entry = new Entry({
      title: "Test",
      category: "A",
      steps: ["Test Schritt"],
      items: ["Test Item"],
    });

    console.log("3 - Entry erstellt");

    await entry.save();

    console.log("4 - Entry gespeichert");

    return response.status(201).json({
      success: true,
      entry,
    });
  } catch (error) {
    console.error("FEHLER:", error);

    return response.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
