"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import StatusPanel from "@/components/map/StatusPanel";
import AttitudePanel from "@/components/map/AttitudePanel";
import FlightProgressBar from "@/components/map/FlightProgressBar";
import SelectFlightLog from "@/components/map/SelectFlightLog";
import ControlPanel from "@/components/map/ControlPanel";
import useData from "@/store/useData";
import useResizePanelControl from "@/hooks/useResizePanelControl";
import useOperationData from "@/hooks/useOperationData";
import { INITIAL_POSITION } from "@/constants";
import TrackingToggle from "@/components/map/TrackingToggle";

// 모든 브라우저 의존성 컴포넌트를 동적 임포트로 변경 (빌드 오류 수정)
const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
});

const MemoizedSelectFlightLog = React.memo(SelectFlightLog);

export default function MapPage() {
  const { isStatusOpen, setIsStatusOpen, isAttitudeOpen, setIsAttitudeOpen } =
    useResizePanelControl();
  const { selectedOperationId } = useData();
  const { updatedStartPoint } = useOperationData();
  const [selectedFlight, setSelectedFlight] = useState(selectedOperationId[0]);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTracking, setIsTracking] = useState(true);
  const [dronePositions, setDronePositions] = useState<
    { flightId: string; position: [number, number]; direction: number }[]
  >([]);
  const [mapPosition, setMapPosition] = useState<[number, number]>([
    INITIAL_POSITION.LAT,
    INITIAL_POSITION.LNG,
  ]);

  useEffect(() => {
    const initialPosition = updatedStartPoint[selectedOperationId[0]];
    setMapPosition(initialPosition);
  }, [updatedStartPoint]);

  useEffect(() => {
    setSelectedFlight(selectedOperationId[0]);
  }, [selectedOperationId]);

  useEffect(() => {
    if (isTracking) {
      trackDronePosition();
    }
  }, [isTracking, progress]);

  const toggleStatusPanel = () => {
    setIsStatusOpen(!isStatusOpen);
  };

  const toggleAttitudePanel = () => {
    setIsAttitudeOpen(!isAttitudeOpen);
  };

  const trackDronePosition = () => {
    const selectedDronePosition = dronePositions.find(
      (drone) => drone.flightId === selectedFlight,
    )?.position;

    if (selectedDronePosition) {
      setMapPosition([...selectedDronePosition]);
    }
  };

  const toggleTracking = () => {
    setIsTracking((prev) => !prev);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden">
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
        <div className="absolute right-8 top-8 z-10 flex max-h-[90%] flex-col gap-2">
          <TrackingToggle
            isTracking={isTracking}
            toggleTracking={toggleTracking}
          />
          <MemoizedSelectFlightLog
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
        <div className="absolute bottom-7 left-1/2 z-10 flex w-11/12 min-w-80 max-w-[800px] -translate-x-1/2 flex-col gap-1">
          <FlightProgressBar
            progress={progress}
            setProgress={setProgress}
            selectedFlight={selectedFlight}
            setSelectedFlight={setSelectedFlight}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
          <div className="flex justify-center">
            <ControlPanel
              onFlightInfoClick={toggleStatusPanel}
              onAttitudeClick={toggleAttitudePanel}
              onZoomClick={trackDronePosition}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
