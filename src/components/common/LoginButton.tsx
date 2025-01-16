"use client";
import useLoginModalStore from "@/store/useLoginModal";
import AuthModal from "@/components/home/AuthModal";
import { AUTH_LOGIN } from "@/type/common/auth-type";

import { signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  let session = useSession();
  const { toggle } = useLoginModalStore();
  return (
    <>
      <button
        onClick={
          session.status === AUTH_LOGIN.STATUS.AUTHENTICATED ? signOut : toggle
        }
      >
        {session.status === AUTH_LOGIN.STATUS.AUTHENTICATED
          ? "logout"
          : "login"}
      </button>
      <AuthModal />
    </>
  );
}
