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
  progress: number;
  selectedTimestamp: number[];
  setSelectedTimestamp: (timestamp: number[]) => void;
  onMarkerClick: (id: string) => void;
}

export default function MapView({
  progress,
  selectedTimestamp,
  setSelectedTimestamp,
  onMarkerClick,
}: MapViewProps) {
  const { telemetryData, selectedOperationId } = useData();
  const [operationLatlngs, setOperationLatlngs] = useState<
    Record<string, [number, number][]>
  >({});
  const [operationTimestamps, setOperationTimestamps] = useState<
    Record<string, number[]>
  >({});
  const [dronePositions, setDronePositions] = useState<
    { flightId: string; position: [number, number]; direction: number }[]
  >([]);

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

    const updatedTimestamps = selectedOperationId.reduce(
      (acc, id) => {
        const rawTimestamps = getOperationTimes(id);
        const timestamps = rawTimestamps.map((timestamp) =>
          Date.parse(timestamp),
        );
        if (timestamps.length > 0) {
          acc[id] = timestamps;
        }
        return acc;
      },
      {} as Record<string, number[]>,
    );

    setOperationLatlngs(updatedLatlngs);
    setOperationTimestamps(updatedTimestamps);
  }, [telemetryData, selectedOperationId]);

  useEffect(() => {
    const allTimestamps = Object.values(operationTimestamps).flat();
    setSelectedTimestamp(allTimestamps.sort((a, b) => a - b));
  }, [operationTimestamps]);

  useEffect(() => {
    if (!selectedTimestamp || selectedTimestamp.length < 2) return;

    const allStartTime = selectedTimestamp[0];
    const allEndTime = selectedTimestamp[selectedTimestamp.length - 1];
    const totalDuration = allEndTime - allStartTime;
    const currentTime = allStartTime + (totalDuration * progress) / 100;

    // 운행별 마커 위치 계산
    const updatedPositions = selectedOperationId.map((id) => {
      const timestamps = operationTimestamps[id] || [];
      const positions = operationLatlngs[id] || [];

      const startTime = timestamps[0];
      const endTime = timestamps[timestamps.length - 1];

      if (currentTime >= startTime && currentTime <= endTime) {
        // 운행별 개별 진행률 계산
        const operationProgress =
          ((currentTime - startTime) / (endTime - startTime)) * 100;

        const position = calculateDronePosition(
          operationProgress,
          positions,
          timestamps,
        );
        const direction = calculateDirection(
          operationProgress,
          positions,
          timestamps,
        );

        return { flightId: id, position, direction };
      }

      return { flightId: id, position: positions[0], direction: 0 }; // 운행 시작 전
    });

    setDronePositions(updatedPositions);
  }, [progress, selectedTimestamp, operationTimestamps, operationLatlngs]);

  // 운행별 위치 데이터 반환
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
    const positionData = telemetryData[33] || [];
    const result = positionData
      .filter((data) => data.operation === operationId)
      .map((data) => data.timestamp);
    return result;
  };

  // 시간별 위치 데이터 계산
  const calculateDronePosition = (
    progress: number,
    positions: [number, number][],
    timestamps: number[],
  ): [number, number] => {
    const totalDuration = timestamps[timestamps.length - 1] - timestamps[0];
    const currentTime = timestamps[0] + (totalDuration * progress) / 100;
    const index = timestamps.findIndex((timestamp) => timestamp >= currentTime);

    if (index === -1) {
      return positions[positions.length - 1];
    }
    if (index === 0) {
      return positions[0];
    }

    // 현재 시간에 대한 위치 계산 (선형 보간)
    const t0 = timestamps[index - 1];
    const t1 = timestamps[index];
    const ratio = (currentTime - t0) / (t1 - t0);

    const pos0 = positions[index - 1];
    const pos1 = positions[index];

    return [
      pos0[0] + (pos1[0] - pos0[0]) * ratio,
      pos0[1] + (pos1[1] - pos0[1]) * ratio,
    ];
  };

  // 방향 계산
  const calculateDirection = (
    progress: number,
    positions: [number, number][],
    timestamps: number[],
  ) => {
    const totalDuration = timestamps[timestamps.length - 1] - timestamps[0];
    const currentTime = timestamps[0] + (totalDuration * progress) / 100;

    let index = -1;
    for (let i = 0; i < timestamps.length - 1; i++) {
      if (currentTime >= timestamps[i] && currentTime <= timestamps[i + 1]) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      return 0;
    }
    if (index === 0) {
      return 0;
    }

    const t0 = timestamps[index];
    const t1 = timestamps[index + 1];
    const pos0 = positions[index];
    const pos1 = positions[index + 1];

    // 방향 계산: 두 위치 간의 방향 각도 계산
    const deltaY = pos1[0] - pos0[0];
    const deltaX = pos1[1] - pos0[1];
    const bearing = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    const droneHeading = (90 - bearing) % 360;

    return droneHeading < 0 ? droneHeading + 360 : droneHeading;
  };

  // 아이콘 생성
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

  // 진행도별 시간 계산
  const calculateCurrentTime = (timestamps: number[], progress: number) => {
    if (!timestamps) return null;
    const totalDuration = timestamps[timestamps.length - 1] - timestamps[0];
    const currentTime = timestamps[0] + (totalDuration * progress) / 100;
    const result = formatTimeString(currentTime);
    return result;
  };

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
                icon={createRotatedIcon(direction)}
              >
                <Popup>
                  <div>
                    <p>
                      시간: {calculateCurrentTime(selectedTimestamp, progress)}
                    </p>
                    <p>위도: {position[0].toFixed(6)}</p>
                    <p>경도: {position[1].toFixed(6)}</p>
                    <p>방향: {Math.round(direction)}°</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}
