"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import useData from "@/store/useData";

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  const { fetchOperationData, fetchRobotData, fetchTelemetryData } = useData();

  useEffect(() => {
    fetchOperationData();
    fetchRobotData();
    fetchTelemetryData();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
