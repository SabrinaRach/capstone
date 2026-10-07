import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// A client that is not connected yet: the driver connects on the first
// operation and retries after a failure. Connecting eagerly with
// client.connect() caches a rejected promise when the first attempt fails
// (e.g. a serverless function frozen mid-connect), which breaks every later
// request handled by the same instance and causes unhandled rejections.
let client;

if (process.env.NODE_ENV === "development") {
  // Reuse the client across hot reloads instead of opening new connections.
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

export default client;
