"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useData from "@/store/useData";
import React, { useEffect, useState } from "react";
import { getColorFromId } from "@/utils/getColorFromId";
import { formatTimeString } from "@/utils/formatTimestamp";

interface MapViewProps {
  selectedFlight: string;
  progress: number;
  onMarkerClick: (id: string) => void;
}

export default function MapView({
  selectedFlight,
  progress,
  onMarkerClick,
}: MapViewProps) {
  const { telemetryData, selectedOperationId } = useData();
  const [operationLatlngs, setOperationLatlngs] = useState<
    Record<string, [number, number][]>
  >({});

  const icon = L.icon({
    iconUrl: "/images/map/marker-icon.png",
    iconSize: [30, 30],
  });

  // 운행별 위치 데이터 반환
  const getOperationlatlings = (operationId: string) => {
    const positionData = telemetryData[33] || []; // msgId 33 데이터(Position)
    const result = positionData
      .filter((data) => data.operation === operationId)
      .map((data) => {
        const lat = data.payload.lat * 1e-7;
        const lon = data.payload.lon * 1e-7;
        return [lat, lon];
      });
    return result as [number, number][];
  };

  // 운행별 시간 데이터 반환
  const getOperationTimes = (operationId: string) => {
    const positionData = telemetryData[33] || []; // msgId 33 데이터(Position)
    const result = positionData
      .filter((data) => data.operation === operationId)
      .map((data) => data.timestamp);
    return result;
  };

  useEffect(() => {
    const updatedLatlngs = selectedOperationId.reduce(
      (acc, id) => {
        const latlngs = getOperationlatlings(id);
        if (latlngs.length > 0) {
          acc[id] = latlngs;
        }
        return acc;
      },
      {} as Record<string, [number, number][]>,
    );
    setOperationLatlngs(updatedLatlngs);
  }, [telemetryData, selectedOperationId]);

  return (
    <div className="relative z-0 h-full w-full">
      <MapContainer
        center={[-35.3632599, 149.1652374]}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedOperationId.map((id) => {
          if (operationLatlngs[id] && operationLatlngs[id].length > 0) {
            // Progress 비율에 따라 위치 계산
            const totalSteps = operationLatlngs[id].length;
            const index =
              selectedFlight === "all" || selectedFlight === id
                ? Math.floor((progress / 100) * (totalSteps - 1))
                : 0;
            const currentPosition = operationLatlngs[id][index];
            const currentTime = getOperationTimes(id)[index];
            return (
              <React.Fragment key={id}>
                <Polyline
                  positions={operationLatlngs[id]}
                  pathOptions={{ color: getColorFromId(id) }}
                />
                <Marker
                  position={currentPosition}
                  icon={icon}
                  eventHandlers={{ click: () => onMarkerClick(id) }}
                >
                  <Popup>
                    <div>
                      <p>시간: {formatTimeString(currentTime)}</p>
                      <p>위도: {currentPosition[0].toFixed(4)}</p>
                      <p>경도: {currentPosition[1].toFixed(4)}</p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          }
        })}
      </MapContainer>
    </div>
  );
}
