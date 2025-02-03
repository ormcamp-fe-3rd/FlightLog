"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useData from "@/store/useData";
import React, { useEffect, useState } from "react";
import { getColorFromId } from "@/utils/getColorFromId";
import { mapCalculator } from "@/utils/mapCalculator";
import useOperationData from "@/hooks/useOperationData";
import useDronePosition from "@/hooks/useDronePosition";
import { DronePosition } from "@/types/types";

interface MapViewProps {
  progress: number;
  operationTimestamps: Record<string, number[]>;
  allTimestamps: number[];
  onMarkerClick: (id: string) => void;
  mapPosition: [number, number];
  dronePositions: DronePosition[];
  setDronePositions: (position: DronePosition[]) => void;
}

export default function MapView({
  progress,
  operationTimestamps,
  allTimestamps,
  onMarkerClick,
  mapPosition,
  dronePositions,
  setDronePositions,
}: MapViewProps) {
  const { selectedOperationId } = useData();
  const { updatedLatlngs } = useOperationData();
  const [operationLatlngs, setOperationLatlngs] = useState<
    Record<string, [number, number][]>
  >({});
  const updatedPositions = useDronePosition(
    progress,
    allTimestamps,
    operationTimestamps,
    operationLatlngs,
  );

  useEffect(() => {
    setOperationLatlngs(updatedLatlngs);
  }, [updatedLatlngs]);

  useEffect(() => {
    setDronePositions(updatedPositions);
  }, [updatedPositions]);

  return (
    <div className="relative z-0 h-full w-full">
      <MapContainer
        center={[37.566381, 126.977717]}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedOperationId.map((id) => {
          const positions = operationLatlngs[id] || [];
          if (positions.length === 0) return null; // 빈 배열인 경우 렌더링하지 않음
          return (
            <Polyline
              key={id}
              positions={positions}
              pathOptions={{ color: getColorFromId(id) }}
              eventHandlers={{ click: () => onMarkerClick(id) }}
            />
          );
        })}
        {dronePositions.length > 0 &&
          dronePositions.map(({ flightId, position, direction }) => {
            if (!position || position.length < 2) {
              return null;
            }
            return (
              <Marker
                key={flightId}
                position={position}
                icon={mapCalculator.createRotatedIcon(direction)}
              >
                <Popup>
                  <div>
                    <p>
                      시간:{" "}
                      {mapCalculator.calculateCurrentTime(
                        allTimestamps,
                        progress,
                      )}
                    </p>
                    <p>위도: {position[0].toFixed(4)}</p>
                    <p>경도: {position[1].toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        <MapLogic position={mapPosition} />
      </MapContainer>
    </div>
  );
}

interface MapLogicProps {
  position: [number, number];
}

function MapLogic({ position }: MapLogicProps) {
  const map = useMap();

  useEffect(() => {
    if (map && position) {
      map.setView(position, map.getZoom());
    }
  }, [map, position]);

  return null;
}
