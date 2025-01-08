import Sidebar from "@/components/common/Sidebar";
import StatusPanel from "@/components/map/StatusPanel";
import AttitudePanel from "@/components/map/AttitudePanel";
import FlightProgressBar from "@/components/map/FlightProgressBar";
import MapView from "@/components/map/MapView";
import ControlPanel from "@/components/map/ControlPanel";

export default function MapPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="relative h-[calc(100vh-56px)] min-w-[344px] flex-1">
        <div className="h-full">
          <MapView />
        </div>
        <div className="absolute right-8 top-8 z-10 h-[55%] w-[280px] overflow-hidden rounded-[30px] bg-black text-white opacity-80">
          <StatusPanel />
        </div>
        <div className="absolute bottom-8 right-8 z-10 size-[280px] rounded-[30px] bg-white opacity-90">
          <AttitudePanel />
        </div>
        <div className="absolute bottom-7 left-1/2 z-10 flex w-1/3 -translate-x-1/2 flex-col items-center">
          <FlightProgressBar />
          <ControlPanel />
        </div>
      </div>
    </div>
  );
}
