import useData from "@/store/useData";
import { useState } from "react";

const { telemetryData, selectedOperationId } = useData();
const [operationLatlngs, setOperationLatlngs] = useState<
  Record<string, [number, number][]>
>({});

// 연결된 위성 수
export const getSatellites = (operationId: string) => {
  const positionData = telemetryData[24] || []; // msgId 24 데이터
  const result = positionData
    .filter((data) => data.operation === operationId)
    .map((data) => {
      const satellites = data.payload.satellitesVisible;

      return [satellites];
    });
  return result as [number][];
};

// 드론의 위치 데이터
export const getPosition = (operationId: string) => {
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

// 드론의 배터리 데이터
export const getBattery = (operationId: string) => {
  const positionData = telemetryData[147] || []; // msgId 33 데이터(Position)
  const result = positionData
    .filter((data) => data.operation === operationId)
    .map((data) => {
      const temperature = data.payload.temperature;
      const voltages = data.payload.voltages;
      const battery_remaining = data.payload.battery_remaining;

      return [temperature, voltages, battery_remaining];
    });
  return result as [number, number, number][];
};
