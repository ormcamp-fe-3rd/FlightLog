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

export default function MapView() {
  const { telemetryData, selectedOperationId } = useData();
  const [operationLatlngs, setOperationLatlngs] = useState<
    Record<string, [number, number][]>
  >({});

  const icon = L.icon({ iconUrl: "/images/map/marker-icon.png" });

  // 운행별 위치 데이터 반환
  const getOperationlatlings = (operationId: string) => {
    const positionData = telemetryData[33] || []; // msgId 33 데이터(Position)
    const result = positionData
      .filter((data) => data.operation === operationId)
      .reduce(
        (acc, value) => {
          const lat = value.payload.lat * 1e-7;
          const lon = value.payload.lon * 1e-7;
          acc.push([lat, lon]);
          return acc;
        },
        [] as [number, number][],
      );
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
            return (
              <React.Fragment key={id}>
                <Polyline
                  positions={operationLatlngs[id]}
                  pathOptions={{ color: getColorFromId(id) }}
                ></Polyline>
              </React.Fragment>
            );
          }
        })}
      </MapContainer>
    </div>
  );
}
