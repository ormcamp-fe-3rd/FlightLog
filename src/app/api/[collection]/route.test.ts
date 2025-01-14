import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import { GET } from "./route";

let mongoServer: MongoMemoryServer;
let client: MongoClient;

beforeAll(async () => {
  // MongoMemoryServer 인스턴스를 생성
  mongoServer = await MongoMemoryServer.create();

  // MongoMemoryServer에서 제공하는 URI를 가져와 MongoDB 클라이언트를 연결
  const uri = mongoServer.getUri();
  client = new MongoClient(uri);
  await client.connect();

  // 실제 데이터베이스에서 테스트할 컬렉션에 데이터를 삽입
  const db = client.db("test");

  // 테스트에 사용할 데이터를 삽입
  await db.collection("validCollection").insertMany([
    { name: "test1", value: 123 },
    { name: "test2", value: 456 },
  ]);
});

afterAll(async () => {
  // 테스트가 끝난 후, 연결을 끊고 메모리 서버를 종료
  if (client) await client.close();
  if (mongoServer) await mongoServer.stop();
});

describe("GET /api/:collection", () => {
  it("should return an error if collection name is invalid", async () => {
    const req = new Request("http://localhost/api/");
    const res = await GET(req, { params: { collection: "" } });

    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("Collection name error");
  });

  it("should return data if collection exists", async () => {
    const db = client.db("test-db");
    const collection = db.collection("validCollection");
    const docs = await collection.find({}).toArray(); // 데이터 조회

    const req = new Request("http://localhost/api/");
    const res = await GET(req, { params: { collection: "validCollection" } });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual(docs); // DB에서 조회한 데이터와 비교
  });

  it("should handle empty collection gracefully", async () => {
    const req = new Request("http://localhost/api/");
    const res = await GET(req, { params: { collection: "emptyCollection" } });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual([]);
  });
});
