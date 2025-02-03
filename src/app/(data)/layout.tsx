"use client";

import Sidebar from "@/components/common/Sidebar";
import useSidebarStore from "@/store/useSidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useLoginModalStore from "@/store/useLoginModal";
import { AUTH_LOGIN } from "@/utils/AuthLogin";

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen } = useSidebarStore();
  const session = useSession();
  const router = useRouter();
  const { toggle } = useLoginModalStore();

  useEffect(() => {
    if (session.status === AUTH_LOGIN.STATUS.UNAUTHENTICATED) {
      router.push("/");
      alert("로그인한 유저만 이용할 수 있는 기능입니다.");
    }
  }, [session.status, toggle, router]);

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <div
        className={`${isSidebarOpen ? "md:block" : "md:hidden"} z-20 md:absolute`}
      >
        <Sidebar />
      </div>
      {children}
    </div>
  );
}
