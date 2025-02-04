import type { MongoClient } from "mongodb";

declare module "@react-three/drei";

declare global {
  namespace globalThis {
    var _mongo: Promise<MongoClient> | undefined;
  }
}
