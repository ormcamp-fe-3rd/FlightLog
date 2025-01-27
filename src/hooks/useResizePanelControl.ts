import { BREAKPOINTS } from "@/constants";
import useSidebarStore from "@/store/useSidebar";
import { useEffect, useState } from "react";

export default function useResizePanelControl() {
  const { close, open } = useSidebarStore();
  const [isStatusOpen, setIsStatusOpen] = useState(true);
  const [isAttitudeOpen, setIsAttitudeOpen] = useState(true);

  const handleResize = () => {
    const isDesktop = window.innerWidth > BREAKPOINTS.TABLET;
    if (!isDesktop) {
      close();
      setIsStatusOpen(false);
      setIsAttitudeOpen(false);
    } else {
      open();
      setIsStatusOpen(true);
      setIsAttitudeOpen(true);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [close, open]);

  return {
    isStatusOpen,
    setIsStatusOpen,
    isAttitudeOpen,
    setIsAttitudeOpen,
  };
}
