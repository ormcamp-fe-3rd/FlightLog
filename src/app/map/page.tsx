import Sidebar from "@/components/common/Sidebar";
import StatusPanel from "@/components/map/StatusPanel";
import AttitudePanel from "@/components/map/AttitudePanel";
import FlightProgressBar from "@/components/map/FlightProgressBar";
import MapView from "@/components/map/MapView";
import ControlPanel from "@/components/map/ControlPanel";

export default function MapPage() {
  const isOpen = false;

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <div className={`md:${isOpen ? "block" : "hidden"} z-20 md:absolute`}>
        <Sidebar />
      </div>
      <div className="relative h-full min-w-[344px] flex-1 border-red-600">
        <div className="h-full">
          <MapView />
        </div>
        <div className="absolute right-8 top-8 z-10 flex h-[90%] flex-col gap-4">
          <StatusPanel />
          <AttitudePanel />
        </div>
        <div className="absolute bottom-7 left-1/2 z-10 w-1/2 -translate-x-1/2 lg:w-80">
          <FlightProgressBar />
          <div className="hidden justify-center md:flex">
            <ControlPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
