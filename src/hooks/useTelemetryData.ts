import useData from "@/store/useData";
import { useEffect, useState } from "react";

interface CombinedData {
  lat?: number | string;
  lon?: number | string;
  alt?: number | string;
  relativeAlt?: number | string; // 상대 고도
  speed?: number | string; // 속도
  heading?: number | string; // 진행 방향
  hAcc?: number | string; // 수평 정확도
  vAcc?: number | string; // 수직 정확도
}

interface Props {
  progress: number;
  selectedTimestamp: number[];
  selectedOperationId: string[];
}

export function useTelemetryData({
  progress,
  selectedTimestamp,
  selectedOperationId,
}: Props) {
  const { telemetryData } = useData();
  const [currentData, setCurrentData] = useState<
    { flightId: string; status: CombinedData }[]
  >([]);

  useEffect(() => {
    if (!selectedTimestamp || selectedTimestamp.length === 0) return;

    const allStartTime = selectedTimestamp[0];
    const allEndTime = selectedTimestamp[selectedTimestamp.length - 1];
    const totalDuration = allEndTime - allStartTime;
    const currentTime = allStartTime + (totalDuration * progress) / 100;

    const updatedStatus = selectedOperationId.map((id) => {
      const positionData = telemetryData[33]
        .map((data) => ({
          ...data,
          timestamp: Date.parse(data.timestamp),
        }))
        .filter((data) => data.timestamp <= currentTime);

      const latestPositionData = positionData[positionData.length - 1];

      const gpsData = telemetryData[24]
        .map((data) => ({
          ...data,
          timestamp: Date.parse(data.timestamp),
        }))
        .filter((data) => data.timestamp <= currentTime);

      const latestGpsData = gpsData[gpsData.length - 1];

      if (!latestPositionData && !latestGpsData) {
        setCurrentData([]);
      }

      // 데이터 병합
      const mergedData: CombinedData = {
        lat: (latestPositionData?.payload.lat * 1e-7).toFixed(4),
        lon: (latestPositionData?.payload.lon * 1e-7).toFixed(4),
        alt: `${latestPositionData?.payload.alt * 1e-3}m`,
        relativeAlt: latestPositionData?.payload.relative_alt * 1e-3,
        speed: `${latestGpsData?.payload.vel.toFixed(2)}m/s`,
        heading: `${(latestPositionData?.payload.hdg * 1e-2).toFixed(2)}°`,
        hAcc: latestGpsData?.payload.hAcc,
        vAcc: latestGpsData?.payload.vAcc,
      };

      return { flightId: id, status: mergedData };
    });

    setCurrentData(updatedStatus);
  }, [telemetryData, progress, selectedTimestamp]);

  return currentData;
}
