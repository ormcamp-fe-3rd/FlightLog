"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import useData from "@/store/useData";

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  const { fetchOperationData, fetchRobotData } = useData();

  useEffect(() => {
    fetchOperationData();
    fetchRobotData();
    // 텔레메트리 데이터는 체크했을 때 받아오도록 변경
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
