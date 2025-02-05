"use client";

import Sidebar from "@/components/common/Sidebar";
import useSidebarStore from "@/store/useSidebar";
import { useRef } from "react";

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, toggle } = useSidebarStore();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSidebarOpen) return;
    if (sidebarRef.current && sidebarRef.current.contains(e.target as Node))
      return;

    toggle();
  };

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <div
        ref={sidebarRef}
        className={`${isSidebarOpen ? "lg:block" : "lg:hidden"} z-20 lg:absolute`}
      >
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto" onClick={handleOutsideClick}>
        {children}
      </div>
    </div>
  );
}
