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
    const initializeData = async () => {
      await fetchOperationData();
      await fetchRobotData();
      await fetchTelemetryData();
    };

    initializeData();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
