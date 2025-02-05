"use client";

import Link from "next/link";
import useSidebarStore from "@/store/useSidebar";
import LoginButton from "./LoginButton";

export default function Header() {
  const { toggle } = useSidebarStore();
  return (
    <header className="flex h-14 items-center justify-between bg-black p-4 text-white">
      <div className="flex items-center gap-5">
        <button className="hidden size-5 md:block" onClick={toggle}>
          <img src="/images/common/icon-menu.svg" alt="Toggle sidebar" />
        </button>
        <Link href="/" className="cursor-pointer text-2xl font-bold">
          FlightLog
        </Link>
      </div>
      <LoginButton />
    </header>
  );
}
