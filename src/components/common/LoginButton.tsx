"use client";
import useLoginModalStore from "@/store/useLoginModal";
import AuthModal from "@/components/home/AuthModal";

import { useSession } from "next-auth/react";

export default function LoginButton() {
  let session = useSession();
  const { toggle } = useLoginModalStore();
  return (
    <>
      <button onClick={toggle}>
        {session.status === "authenticated" ? "logout" : "login"}
      </button>
      <AuthModal />
    </>
  );
}
