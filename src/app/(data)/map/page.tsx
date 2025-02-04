"use client";

import StatusPanel from "@/components/map/StatusPanel";
import AttitudePanel from "@/components/map/AttitudePanel";
import FlightProgressBar from "@/components/map/FlightProgressBar";
import SelectFlightLog from "@/components/map/SelectFlightLog";
import MapView from "@/components/map/MapView";
import ControlPanel from "@/components/map/ControlPanel";
import { useEffect, useState } from "react";
import useData from "@/store/useData";
import useSidebarStore from "@/store/useSidebar";
import useResizePanelControl from "@/hooks/useResizePanelControl";
import useOperationData from "@/hooks/useOperationData";
import { INITIAL_POSITION } from "@/constants";

export default function MapPage() {
  const { isSidebarOpen } = useSidebarStore();
  const { isStatusOpen, setIsStatusOpen, isAttitudeOpen, setIsAttitudeOpen } =
    useResizePanelControl();
  const { selectedOperationId, setAllTimestamps, setOperationTimestamps } =
    useData();
  const { updatedTimestamps, updatedStartPoint } = useOperationData();
  const [selectedFlight, setSelectedFlight] = useState(selectedOperationId[0]);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dronePositions, setDronePositions] = useState<
    { flightId: string; position: [number, number]; direction: number }[]
  >([]);
  const [mapPosition, setMapPosition] = useState<[number, number]>([
    INITIAL_POSITION.LAT,
    INITIAL_POSITION.LNG,
  ]);

  useEffect(() => {
    const sortedAllTimestamps = Object.values(updatedTimestamps)
      .flat()
      .sort((a, b) => a - b);
    setOperationTimestamps(updatedTimestamps);
    setAllTimestamps(sortedAllTimestamps);

    const initialPosition = updatedStartPoint[selectedOperationId[0]];
    setMapPosition(initialPosition);
  }, [updatedTimestamps, updatedStartPoint]);

  useEffect(() => {
    setSelectedFlight(selectedOperationId[0]);
  }, [selectedOperationId]);

  const toggleStatusPanel = () => {
    setIsStatusOpen(!isStatusOpen);
  };

  const toggleAttitudePanel = () => {
    setIsAttitudeOpen(!isAttitudeOpen);
  };

  const zoomToDrone = () => {
    const selectedDronePosition = dronePositions.find(
      (drone) => drone.flightId === selectedFlight,
    )?.position;

    if (selectedDronePosition) {
      setMapPosition(selectedDronePosition);
    } else {
      console.warn(`Start point not found for ID: ${selectedFlight}`);
    }
  };

  return (
    <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden">
      <div
        className={`${isSidebarOpen ? "md:block" : "md:hidden"} z-20 md:absolute`}
      ></div>
      <div className="relative h-full w-full flex-1">
        <div className="h-full w-full">
          <MapView
            progress={progress}
            onMarkerClick={setSelectedFlight}
            mapPosition={mapPosition}
            dronePositions={dronePositions}
            setDronePositions={setDronePositions}
          />
        </div>
        <div className="absolute right-8 top-8 z-10 flex max-h-[90%] flex-col gap-4">
          <SelectFlightLog
            value={selectedFlight}
            onSelect={setSelectedFlight}
          />
          <div
            className={`${isStatusOpen ? "block" : "hidden"} overflow-hidden overflow-y-auto rounded-[30px]`}
          >
            <StatusPanel progress={progress} selectedFlight={selectedFlight} />
          </div>
          <div className={`${isAttitudeOpen ? "block" : "hidden"}`}>
            <AttitudePanel
              progress={progress}
              selectedFlight={selectedFlight}
              isPlaying={isPlaying}
            />
          </div>
        </div>
        <div className="absolute bottom-7 left-1/2 z-10 flex w-2/3 min-w-80 -translate-x-1/2 flex-col gap-1">
          <FlightProgressBar
            progress={progress}
            setProgress={setProgress}
            setSelectedFlight={setSelectedFlight}
            setIsPlaying={setIsPlaying}
          />
          <div className="flex justify-center">
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
