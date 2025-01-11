"use client";
import useLoginModalStore from "@/store/useLoginModal";
import AuthModal from "@/components/home/AuthModal";

export default function LoginButton() {
  const { toggle } = useLoginModalStore();
  return (
    <>
      <button onClick={toggle}>Login</button>
      <AuthModal />
    </>
  );
}
