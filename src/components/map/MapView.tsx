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

<<<<<<< HEAD
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
=======
interface Props {
  progress: number;
}

export default function MapView({ progress }: Props) {
>>>>>>> 2742578 ([feat] 프로그래스바 조작에 맞춰 드론마커 위치 업데이트)
  const { telemetryData, selectedOperationId } = useData();
  const [operationLatlngs, setOperationLatlngs] = useState<
    Record<string, [number, number][]>
  >({});

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
<<<<<<< HEAD
            // Progress 비율에 따라 위치 계산
            const totalSteps = operationLatlngs[id].length;
<<<<<<< HEAD
            const index =
              selectedFlight === "all" || selectedFlight === id
                ? Math.floor((progress / 100) * (totalSteps - 1))
                : 0;
            const currentPosition = operationLatlngs[id][index];
            const currentTime = getOperationTimes(id)[index];
=======
            const index = Math.floor((progress / 100) * (totalSteps - 1));
            const currentPosition = operationLatlngs[id][index];
>>>>>>> 2742578 ([feat] 프로그래스바 조작에 맞춰 드론마커 위치 업데이트)
=======
            const positions = operationLatlngs[id];
            const totalSteps = positions.length - 1;
            const exactProgress = (progress / 100) * totalSteps;
            const currentIndex = Math.floor(exactProgress);
            const nextIndex = Math.min(currentIndex + 1, totalSteps);

            const segmentProgress = exactProgress - currentIndex;
            const currentPoint = positions[currentIndex];
            const nextPoint = positions[nextIndex];

            const interpolatedPosition = interpolatePosition(
              currentPoint,
              nextPoint,
              segmentProgress,
            );

            const direction = calculateDirection(currentPoint, nextPoint);
            const rotatedIcon = createRotatedIcon(direction);

>>>>>>> 0388e4b ([feat] 지도에서 드론이 경로 따라 움직일때 진행방향에 따라서 회전하도록 수정, 버전 안정화)
            return (
              <React.Fragment key={id}>
                <Polyline
                  positions={positions}
                  pathOptions={{ color: getColorFromId(id) }}
                />
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
                <Marker position={currentPosition} icon={icon}>
                  <Popup>
                    <div>
                      <p>운행 ID: {id}</p>
                      <p>위도: {currentPosition[0]}</p>
                      <p>경도: {currentPosition[1]}</p>
>>>>>>> 2742578 ([feat] 프로그래스바 조작에 맞춰 드론마커 위치 업데이트)
=======
                <Marker position={interpolatedPosition} icon={rotatedIcon}>
                  <Popup>
                    <div>
                      <p>운행 ID: {id}</p>
                      <p>위도: {interpolatedPosition[0].toFixed(6)}</p>
                      <p>경도: {interpolatedPosition[1].toFixed(6)}</p>
                      <p>방향: {Math.round(direction)}°</p>
>>>>>>> 0388e4b ([feat] 지도에서 드론이 경로 따라 움직일때 진행방향에 따라서 회전하도록 수정, 버전 안정화)
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
