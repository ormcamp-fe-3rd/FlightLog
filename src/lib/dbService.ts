import { connectDB } from "@/lib/database";

// 조건 설정 가능 ; query = { msgId: 30 }
export async function fetchCollection(
  collectionName: string,
  query: Record<string, unknown> = {},
) {
  const client = await connectDB;
  const db = client.db("data");
  const collection = db.collection(collectionName);

  Object.keys(query).forEach((key) => {
    if (!isNaN(Number(query[key]))) {
      query[key] = Number(query[key]);
    }
  });

  if (query) {
    return collection.find(query).toArray();
  } else {
    return collection.find({}).toArray();
  }
}
