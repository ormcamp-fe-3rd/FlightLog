"use client";
import useLoginModalStore from "@/store/useLoginModal";
import LoginModal from "@/components/home/LoginModal";

export default function LoginButton() {
  const { toggle } = useLoginModalStore();
  return (
    <>
      <button onClick={toggle}>Login</button>
      <LoginModal />
    </>
  );
}
