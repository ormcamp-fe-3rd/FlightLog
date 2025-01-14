"use client";

import { signIn } from "next-auth/react";

export default function SocialLoginButton() {
  return (
    <>
      <button
        className="btn btn-primary btn-sm mt-4 w-full rounded-full"
        onClick={() => signIn("github")}
      >
        GitHub로 로그인
      </button>

      <button
        className="btn btn-secondary btn-sm mt-4 w-full rounded-full"
        onClick={() => signIn("google")}
      >
        Google로 로그인
      </button>
    </>
  );
}
