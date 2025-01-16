import { NextResponse } from "next/server";
import { connectDB } from "../../../../util/common/database";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const hash = await bcrypt.hash(data.password as string, 10);
    data.password = hash;

    const db = (await connectDB).db("user");
    await db.collection("account").insertOne(data);

    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    return NextResponse.json({ message: "가입 실패" }, { status: 500 });
  }
}
