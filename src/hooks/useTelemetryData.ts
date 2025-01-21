import useData from "@/store/useData";
import { Telemetries } from "@/types/api";
import { useEffect, useState } from "react";

interface CombinedData {
  lat?: number | string;
  lon?: number | string;
  alt?: number | string;
  speed?: number | string; // 속도
  heading?: number | string; // 진행 방향
  groundSpeed?: number | string; // 지면 속도
  roll?: number | string; // 롤 각도
  pitch?: number | string; // 피치 각도
  yaw?: number | string; // 요 각도
  batteryRemaining?: number | string; // 배터리 잔량
  energyConsumed?: number | string; // 소비된 에너지
  statusMessage?: string; // 상태 메시지
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
      const latestPositionData = getLatestData(telemetryData, 33, currentTime);
      const latestGpsData = getLatestData(telemetryData, 24, currentTime);
      const latestSpeedData = getLatestData(telemetryData, 74, currentTime);
      const latestAttitudeData = getLatestData(telemetryData, 30, currentTime);
      const latestBatteryData = getLatestData(telemetryData, 147, currentTime);
      const latestStatusData = getLatestData(telemetryData, 253, currentTime);

      if (!latestPositionData && !latestGpsData) {
        setCurrentData([]);
      }

      // 데이터 병합
      const mergedData: CombinedData = {
        lat: (latestPositionData?.payload.lat * 1e-7).toFixed(4),
        lon: (latestPositionData?.payload.lon * 1e-7).toFixed(4),
        alt: `${(latestPositionData?.payload.alt * 1e-3).toFixed(2)}m`,
        heading: `${(latestPositionData?.payload.hdg * 1e-2).toFixed(2)}°`,
        speed: `${latestGpsData?.payload.vel.toFixed(2)}m/s`,

        groundSpeed: `${latestSpeedData?.payload.groundspeed?.toFixed(2)}m/s`,
        roll: latestAttitudeData?.payload.roll?.toFixed(2),
        pitch: latestAttitudeData?.payload.pitch?.toFixed(2),
        yaw: latestAttitudeData?.payload.yaw?.toFixed(2),

        batteryRemaining: `${latestBatteryData?.payload.batteryRemaining}%`,
        energyConsumed: `${latestBatteryData?.payload.energyConsumed}mWh`,
        statusMessage: latestStatusData?.payload.text,
      };

      return { flightId: id, status: mergedData };
    });

    setCurrentData(updatedStatus);
  }, [telemetryData, progress, selectedTimestamp]);

  const getLatestData = (
    telemetryData: { [key: string]: Telemetries[] },
    id: number,
    currentTime: number,
  ) => {
    const filteredData = telemetryData[id]
      ?.map((data) => ({
        ...data,
        timestamp: Date.parse(data.timestamp),
      }))
      .filter((data) => data.timestamp <= currentTime);

    return filteredData?.[filteredData.length - 1] ?? null;
  };

  return currentData;
}
