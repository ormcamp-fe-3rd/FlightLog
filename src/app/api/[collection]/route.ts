import { NextResponse } from "next/server";
import { fetchCollection } from "@/lib/dbService";

export async function GET(
  req: Request,
  { params }: { params: { collection: string } },
) {
  const { collection } = params;
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams.entries());

  if (!collection || typeof collection !== "string") {
    return NextResponse.json(
      { error: "Collection name error" },
      { status: 400 },
    );
  }

  try {
    const data = await fetchCollection(collection, query);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 },
    );
  }
}
