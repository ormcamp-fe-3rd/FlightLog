"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import useData from "@/store/useData";
import { usePathname, useRouter } from "next/navigation";
import { AUTH_LOGIN } from "@/utils/AuthLogin";
import useLoginModalStore from "@/store/useLoginModal";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useLoginModalStore();

  // 회원 인증이 필요한 경로
  const PROTECTED_PATHS = ["/map", "/log"];

  const isProtectedRoute = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  useEffect(() => {
    if (isProtectedRoute && status === AUTH_LOGIN.STATUS.UNAUTHENTICATED) {
      router.push("/");
      alert("로그인한 유저만 이용할 수 있는 기능입니다.");
    }
  }, [status, pathname]);

  // 로그인 유저가 아니면 아무것도 렌더링하지 않음
  if (isProtectedRoute && status !== AUTH_LOGIN.STATUS.AUTHENTICATED) {
    return null;
  }

  return <>{children}</>;
}

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  const { fetchOperationData, fetchRobotData, fetchInitialTelemetries } =
    useData();

  useEffect(() => {
    const initializeData = async () => {
      await fetchOperationData();
      await fetchRobotData();
      await fetchInitialTelemetries();
    };

    initializeData();
  }, []);

  return (
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}
