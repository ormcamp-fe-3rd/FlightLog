"use client";

import Sidebar from "@/components/common/Sidebar";
import useSidebarStore from "@/store/useSidebar";

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen } = useSidebarStore();

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
