"use client";
import useLoginModalStore from "@/store/useLoginModal";
import AuthModal from "@/components/home/AuthModal";
import { AUTH_LOGIN } from "@/utils/AuthLogin";

import { signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const session = useSession();
  const { open } = useLoginModalStore();

  const handleAuth = () => {
    if (session.status === AUTH_LOGIN.STATUS.AUTHENTICATED) {
      signOut({ callbackUrl: "/" });
    } else {
      open();
    }
  };

  return (
    <>
      <button onClick={handleAuth}>
        {session.status === AUTH_LOGIN.STATUS.AUTHENTICATED
          ? "Logout"
          : "Login"}
      </button>
      <AuthModal />
    </>
  );
}
