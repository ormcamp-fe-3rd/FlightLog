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
  onAttitudeChange: (data: {
    roll: number;
    pitch: number;
    yaw: number;
    rollSpeed: number;
    pitchSpeed: number;
    yawSpeed: number;
  }) => void;
}

export default function MapView({
  selectedFlight,
  progress,
  onMarkerClick,
  onAttitudeChange,
}: MapViewProps) {
  const { telemetryData, selectedOperationId } = useData();
  const [operationLatlngs, setOperationLatlngs] = useState<
    Record<string, [number, number][]>
  >({});
  const [prevAttitude, setPrevAttitude] = useState({
    roll: 0,
    pitch: 0,
    yaw: 0,
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

  const calculateRollPitch = (
    currentPoint: [number, number, number],
    nextPoint: [number, number, number],
  ) => {
    const dx = nextPoint[0] - currentPoint[0];
    const dy = nextPoint[1] - currentPoint[1];
    const dz = nextPoint[2] - currentPoint[2];

    const pitch = Math.atan2(dz, Math.sqrt(dx * dx + dy * dy));
    const roll = Math.atan2(dy, dx);

    return { roll, pitch };
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
        const alt = data.payload.alt * 1e-3;
        const time = data.timestamp;
        return [lat, lon, alt, time];
      });
    return result as [number, number, number, string][];
  };

  useEffect(() => {
    const updatedLatlngs = selectedOperationId.reduce(
      (acc, id) => {
        const latlngs = getOperationlatlings(id)
          .map(([lat, lon]) => {
            if (typeof lat === "number" && typeof lon === "number") {
              return [lat, lon] as [number, number];
            }
            return null;
          })
          .filter((item): item is [number, number] => item !== null);
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
            const positions = getOperationlatlings(id);
            const totalSteps = positions.length - 1;
            const exactProgress =
              selectedFlight === "all" || selectedFlight === id
                ? (progress / 100) * totalSteps
                : 0;
            const currentIndex = Math.floor(exactProgress);
            const nextIndex = Math.min(currentIndex + 1, totalSteps);
            const prevIndex = Math.max(0, currentIndex - 1);

            const segmentProgress = exactProgress - currentIndex;
            const currentPoint = positions[currentIndex] as [
              number,
              number,
              number,
              string,
            ];
            const nextPoint = positions[nextIndex] as [
              number,
              number,
              number,
              string,
            ];
            const prevPoint = positions[prevIndex] as [
              number,
              number,
              number,
              string,
            ];

            const direction = calculateDirection(
              [currentPoint[0], currentPoint[1]],
              [nextPoint[0], nextPoint[1]],
            );
            const { roll, pitch } = calculateRollPitch(
              [currentPoint[0], currentPoint[1], currentPoint[2]],
              [nextPoint[0], nextPoint[1], nextPoint[2]],
            );

            // 속도 계산 (이전 위치와 현재 위치의 차이)
            const timeStep = 0.1; // 가정된 시간 간격 (초)
            const rollSpeed = (roll - prevAttitude.roll) / timeStep;
            const pitchSpeed = (pitch - prevAttitude.pitch) / timeStep;
            const yawSpeed = (direction - prevAttitude.yaw) / timeStep;

            // 현재 자세 저장
            setPrevAttitude({ roll, pitch, yaw: direction });

            const interpolatedPosition = interpolatePosition(
              [currentPoint[0], currentPoint[1]],
              [nextPoint[0], nextPoint[1]],
              segmentProgress,
            );

            onAttitudeChange({
              roll,
              pitch,
              yaw: direction,
              rollSpeed,
              pitchSpeed,
              yawSpeed,
            });

            const rotatedIcon = createRotatedIcon(direction);

            return (
              <React.Fragment key={id}>
                <Polyline
                  positions={positions.map((pos) => [pos[0], pos[1]])}
                  pathOptions={{ color: getColorFromId(id) }}
                />
                <Marker
                  position={[interpolatedPosition[0], interpolatedPosition[1]]}
                  icon={rotatedIcon}
                  eventHandlers={{ click: () => onMarkerClick(id) }}
                >
                  <Popup>
                    <div>
                      {currentPoint[3] && (
                        <p>
                          시간: {formatTimeString(currentPoint[3] as string)}
                        </p>
                      )}
                      <p>위도: {interpolatedPosition[0].toFixed(6)}</p>
                      <p>경도: {interpolatedPosition[1].toFixed(6)}</p>
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
