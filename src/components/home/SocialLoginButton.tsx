"use client";

import { signIn } from "next-auth/react";

export default function SocialLoginButton() {
  return (
    <>
      <button
        className="btn btn-sm mt-6 w-full rounded-full bg-zinc-200 hover:bg-zinc-300"
        onClick={() => signIn("github")}
      >
        GitHub로 로그인
      </button>

      <button
        className="btn btn-sm mt-3 w-full rounded-full bg-zinc-200 hover:bg-zinc-300"
        onClick={() => signIn("google")}
      >
        Google로 로그인
      </button>
    </>
  );
}
