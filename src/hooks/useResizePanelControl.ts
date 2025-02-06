import { BREAKPOINTS } from "@/constants";
import useSidebarStore from "@/store/useSidebar";
import { useEffect, useState } from "react";

export default function useResizePanelControl() {
  const { open } = useSidebarStore();
  const [isStatusOpen, setIsStatusOpen] = useState(true);
  const [isAttitudeOpen, setIsAttitudeOpen] = useState(true);

  const handleResize = () => {
    const isDesktop = window.innerWidth > BREAKPOINTS.DESKTOP;
    if (!isDesktop) {
      setIsStatusOpen(false);
      setIsAttitudeOpen(false);
    } else {
      setIsStatusOpen(true);
      setIsAttitudeOpen(true);
    }
    open();
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  return {
    isStatusOpen,
    setIsStatusOpen,
    isAttitudeOpen,
    setIsAttitudeOpen,
  };
}
