"use client";

import Sidebar from "@/components/common/Sidebar";
import StatusPanel from "@/components/map/StatusPanel";
import AttitudePanel from "@/components/map/AttitudePanel";
import FlightProgressBar from "@/components/map/FlightProgressBar";
import MapView from "@/components/map/MapView";
import ControlPanel from "@/components/map/ControlPanel";
import { useEffect, useState } from "react";
import useSidebarStore from "@/store/useSidebar";

export default function MapPage() {
  const { isSidebarOpen, close, open } = useSidebarStore();
  const [isStatusOpen, setIsStatusOpen] = useState(true);
  const [isAttitudeOpen, setIsAttitudeOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth > 744;
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

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [close, open]);

  const toggleStatusPanel = () => {
    setIsStatusOpen(!isStatusOpen);
  };

  const toggleAttitudePanel = () => {
    setIsAttitudeOpen(!isAttitudeOpen);
  };

  const zoomToDrone = () => {
    // Todo
  };

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <div
        className={`${isSidebarOpen ? "md:block" : "md:hidden"} z-20 md:absolute`}
      >
        <Sidebar />
      </div>
      <div className="relative h-full min-w-[344px] flex-1 border-red-600">
        <div className="h-full">
          <MapView />
        </div>
        <div className="absolute right-8 top-8 z-10 flex h-[90%] flex-col gap-4">
          <div
            className={`${isStatusOpen ? "block" : "hidden"} overflow-hidden`}
          >
            <StatusPanel />
          </div>
          <div className={`${isAttitudeOpen ? "block" : "hidden"}`}>
            <AttitudePanel />
          </div>
        </div>
        <div className="absolute bottom-7 left-1/2 z-10 w-1/2 min-w-80 -translate-x-1/2">
          <FlightProgressBar />
          <div className="hidden justify-center md:flex">
            <ControlPanel
              onFlightInfoClick={toggleStatusPanel}
              onAttitudeClick={toggleAttitudePanel}
              onZoomClick={zoomToDrone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
