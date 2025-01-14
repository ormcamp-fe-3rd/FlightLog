"use client";
import useLoginModalStore from "@/store/useLoginModal";
import AuthModal from "@/components/home/AuthModal";

import { signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  let session = useSession();
  const { toggle } = useLoginModalStore();
  return (
    <>
      <button onClick={session.status === "authenticated" ? signOut : toggle}>
        {session.status === "authenticated" ? "logout" : "login"}
      </button>
      <AuthModal />
    </>
  );
}
