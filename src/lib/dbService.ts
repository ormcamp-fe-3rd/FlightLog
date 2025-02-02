import { connectDB } from "@/lib/database";
import { ObjectId } from "mongodb";

// 조건 설정 가능 ; query = { msgId: 30 }
export async function fetchCollection(
  collectionName: string,
  query: Record<string, unknown> = {},
) {
  const client = await connectDB;
  const db = client.db("data");
  const collection = db.collection(collectionName);

  if (query.operation) {
    try {
      query.operation = new ObjectId(query.operation);
    } catch (error) {
      console.warn("Invalid ObjectId format for operation:", query.operation);
    }
  }

  Object.keys(query).forEach((key) => {
    if (!isNaN(Number(query[key]))) {
      query[key] = Number(query[key]);
    }
  });

  return collection.find(query).toArray();
}
