import { connectDB } from "@/lib/database";

export async function fetchCollection(collectionName: string) {
  const client = await connectDB;
  const db = client.db("data");
  const collection = db.collection(collectionName);

  return collection.find({}).toArray();
}
