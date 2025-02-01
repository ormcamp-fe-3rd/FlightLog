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

interface MapViewProps {
  progress: number;
  operationTimestamps: Record<string, number[]>;
  setOperationTimestamps: (timestamp: Record<string, number[]>) => void;
  allTimestamps: number[];
  onMarkerClick: (id: string) => void;
  operationStartPoint: Record<string, [number, number]> | undefined;
  setOperationStartPoint: (
    startpoints: Record<string, [number, number]>,
  ) => void;
  mapPosition: [number, number];
  setMapPosition: (latlng: [number, number]) => void;
}

export default function MapView({
  progress,
  operationTimestamps,
  setOperationTimestamps,
  allTimestamps,
  onMarkerClick,
  operationStartPoint,
  setOperationStartPoint,
  mapPosition,
  setMapPosition,
}: MapViewProps) {
  const { telemetryData, selectedOperationId } = useData();
  const [operationLatlngs, setOperationLatlngs] = useState<
    Record<string, [number, number][]>
  >({});
  const [dronePositions, setDronePositions] = useState<
    { flightId: string; position: [number, number]; direction: number }[]
  >([]);

  useEffect(() => {
    const positionData = telemetryData[33] || [];

    const updatedLatlngs = selectedOperationId.reduce(
      (acc, id) => {
        const latlngs = mapCalculator.getOperationlatlings(id, positionData);
        if (latlngs.length > 0) {
          acc[id] = latlngs;
        }
        return acc;
      },
      {} as Record<string, [number, number][]>,
    );

    const updatedTimestamps = selectedOperationId.reduce(
      (acc, id) => {
        const rawTimestamps = mapCalculator.getOperationTimes(id, positionData);
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

    const updatedStartPoint = selectedOperationId.reduce(
      (acc, id) => {
        const startPoint = updatedLatlngs[id][0];
        acc[id] = startPoint;
        return acc;
      },
      {} as Record<string, [number, number]>,
    );

    if (operationStartPoint) {
      setMapPosition(updatedStartPoint[selectedOperationId[0]]);
    }

    setOperationLatlngs(updatedLatlngs);
    setOperationTimestamps(updatedTimestamps);
    setOperationStartPoint(updatedStartPoint);
  }, [telemetryData, selectedOperationId]);

  useEffect(() => {
    if (!allTimestamps || allTimestamps.length < 2) return;

    const allStartTime = allTimestamps[0];
    const allEndTime = allTimestamps[allTimestamps.length - 1];
    const totalDuration = allEndTime - allStartTime;
    const currentTime = allStartTime + (totalDuration * progress) / 100;

    // 운행별 마커 위치 계산
    const updatedPositions = selectedOperationId.map((id) => {
      const timestamps = operationTimestamps[id] || [];
      const positions = operationLatlngs[id] || [];

      const startTime = timestamps[0];
      const endTime = timestamps[timestamps.length - 1];

      // 운행 시작 전
      if (currentTime < startTime) {
        return { flightId: id, position: positions[0], direction: 0 };
      }

      // 운행 중
      if (currentTime >= startTime && currentTime <= endTime) {
        // 개별 진행률 계산
        const operationProgress =
          ((currentTime - startTime) / (endTime - startTime)) * 100;

        const position = mapCalculator.calculateDronePosition(
          operationProgress,
          positions,
          timestamps,
        );
        const direction = mapCalculator.calculateDirection(
          operationProgress,
          positions,
          timestamps,
        );

        return { flightId: id, position, direction };
      }

      // 운행 종료 후
      return {
        flightId: id,
        position: positions[positions.length - 1],
        direction: 0,
      };
    });

    setDronePositions(updatedPositions);
  }, [progress, allTimestamps, operationTimestamps, operationLatlngs]);

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
