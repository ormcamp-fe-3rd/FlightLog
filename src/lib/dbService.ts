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

  const { limit, ...getRestQuery } = query;

  if (getRestQuery.operation) {
    try {
      if (typeof getRestQuery.operation === "string") {
        getRestQuery.operation = new ObjectId(getRestQuery.operation);
      }
    } catch (error) {
      throw new Error("올바르지 않은 ObjectId 형식입니다");
    }
  }

  // 숫자 형식의 문자열을 숫자 타입으로 변환
  Object.keys(getRestQuery).forEach((key) => {
    if (!isNaN(Number(getRestQuery[key]))) {
      getRestQuery[key] = Number(getRestQuery[key]);
    }
  });

  let cursor = collection.find(getRestQuery);

  // limit 파라미터로 받을 데이터 갯수 제한
  if (limit) {
    cursor = cursor.limit(Number(limit));
  }

  return cursor.toArray();
}

export async function fetchFirstTelemetry(operationId: string) {
  const client = await connectDB;
  const db = client.db("data");
  const collection = db.collection("telemetries");

  try {
    const query = { operation: new ObjectId(operationId) };
    // 체크박스 라벨링을 위해 해당 operation의 첫 번째 telemetry만 반환
    return collection.findOne(query);
  } catch (error) {
    throw new Error("올바르지 않은 ObjectId 형식입니다");
  }
}
