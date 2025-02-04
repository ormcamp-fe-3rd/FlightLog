"use client";

import React, { useState } from "react";
import useLoginModalStore from "@/store/useLoginModal";
import LoginContent from "@/components/home/LoginContent";
import RegisterContent from "@/components/home/RegisterContent";
import SocialLoginButton from "@/components/home/SocialLoginButton";
import usePreventScroll from "@/hooks/usePreventScroll";

export default function AuthModal() {
  const { toggle, isLoginModalOpen } = useLoginModalStore();
  const [register, setRegister] = useState(false);

  usePreventScroll(isLoginModalOpen);

  const handleClose = () => {
    const form = document.querySelector("form");
    if (form) form.reset();
    setRegister(false);
    toggle();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 ${isLoginModalOpen ? null : "hidden"}`}
    >
      <div
        className="w-96 rounded-lg bg-white p-12 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {register === true ? (
          <RegisterContent onClose={handleClose} />
        ) : (
          <LoginContent onClose={handleClose} />
        )}

        <SocialLoginButton />

        <p className="mt-4 text-center text-sm text-gray-700">
          {register === true
            ? `이미 계정이 있으신가요?`
            : `아직 계정이 없으신가요?`}

          <button
            onClick={() => {
              setRegister(!register);
            }}
            className="ml-2 font-bold text-black hover:underline"
          >
            {register === true ? `로그인하기` : `회원 가입하기`}
          </button>
        </p>
      </div>
    </div>
  );
}
