"use client";

import { signIn, signOut } from "next-auth/react";

export default function SocialLoginButton() {
  return (
    <button
      className="btn btn-primary btn-sm mt-4 w-full rounded-full"
      onClick={() => signIn()}
    >
      GitHub로 로그인
    </button>
  );
}
