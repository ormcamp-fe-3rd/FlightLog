import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import bcrypt from "bcryptjs";

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

    if (await db.collection("account").findOne({ email: data.email })) {
      return NextResponse.json(
        { message: "이미 가입한 회원입니다." },
        { status: 400 },
      );
    } else {
      await db.collection("account").insertOne(data);
    }

    return NextResponse.json(
      { message: "가입이 완료되었습니다." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "가입에 실패했습니다." },
      { status: 500 },
    );
  }
}
