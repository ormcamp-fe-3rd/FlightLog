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

  const calculateDirection = (
    currentPoint: [number, number],
    nextPoint: [number, number],
  ) => {
    const deltaY = nextPoint[0] - currentPoint[0];
    const deltaX = nextPoint[1] - currentPoint[1];
    const bearing = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    const droneHeading = (90 - bearing) % 360;

    return droneHeading < 0 ? droneHeading + 360 : droneHeading;
  };

  const createRotatedIcon = (rotationAngle: number) =>
    L.divIcon({
      className: "",
      html: `
        <div 
          style="
            width: 30px; 
            height: 30px; 
            background: url('/images/map/marker-icon.png') no-repeat center/contain; 
            transform: rotate(${rotationAngle}deg);
            transition: transform 0.3s ease;
          ">
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

  const interpolatePosition = (
    position1: [number, number],
    position2: [number, number],
    factor: number,
  ): [number, number] => {
    return [
      position1[0] + (position2[0] - position1[0]) * factor,
      position1[1] + (position2[1] - position1[1]) * factor,
    ];
  };

  const getOperationlatlings = (operationId: string) => {
    const positionData = telemetryData[33] || [];
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
            const positions = operationLatlngs[id];
            const totalSteps = positions.length - 1;
            const exactProgress =
              selectedFlight === "all" || selectedFlight === id
                ? (progress / 100) * totalSteps
                : 0;
            const currentIndex = Math.floor(exactProgress);
            const nextIndex = Math.min(currentIndex + 1, totalSteps);

            const segmentProgress = exactProgress - currentIndex;
            const currentPoint = positions[currentIndex];
            const nextPoint = positions[nextIndex];
            const currentTime = getOperationTimes(id)[currentIndex];

            const interpolatedPosition = interpolatePosition(
              currentPoint,
              nextPoint,
              segmentProgress,
            );

            const direction = calculateDirection(currentPoint, nextPoint);
            const rotatedIcon = createRotatedIcon(direction);

            return (
              <React.Fragment key={id}>
                <Polyline
                  positions={positions}
                  pathOptions={{ color: getColorFromId(id) }}
                />
                <Marker
                  position={interpolatedPosition}
                  icon={rotatedIcon}
                  eventHandlers={{ click: () => onMarkerClick(id) }}
                >
                  <Popup>
                    <div>
                      <p>시간: {formatTimeString(currentTime)}</p>
                      <p>위도: {interpolatedPosition[0].toFixed(6)}</p>
                      <p>경도: {interpolatedPosition[1].toFixed(6)}</p>
                      <p>방향: {Math.round(direction)}°</p>
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
