"use client";

import React, { useEffect } from "react";
import useLoginModalStore from "@/store/useLoginModal";
import LoginContent from "@/components/home/LoginContent";

export default function AuthModal() {
  const { toggle, isLoginModalOpen } = useLoginModalStore();

  useEffect(() => {
    if (isLoginModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isLoginModalOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 ${isLoginModalOpen ? null : "hidden"}`}
      onClick={toggle}
    >
      <div
        className="w-96 rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <LoginContent />
        <p className="mt-4 text-center text-sm text-gray-700">
          Don't have an account?
          <button className="ml-2 font-bold text-black hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
