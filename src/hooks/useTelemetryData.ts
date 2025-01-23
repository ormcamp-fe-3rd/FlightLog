import { CONVERSION_FACTORS, TELEMETRY_MSGID } from "@/constants";
import useData from "@/store/useData";
import { Telemetries } from "@/types/api";
import { useEffect, useState } from "react";

interface CombinedData {
  lat?: number;
  lon?: number;
  alt?: number;
  speed?: number; // 속도
  heading?: number; // 진행 방향
  groundSpeed?: number; // 지면 속도
  roll?: number; // 롤 각도
  pitch?: number; // 피치 각도
  yaw?: number; // 요 각도
  batteryRemaining?: number; // 배터리 잔량
  energyConsumed?: number; // 소비된 에너지
  statusMessage?: string; // 상태 메시지
}

interface Props {
  progress: number;
  allTimestamps: number[];
  selectedOperationId: string[];
}

export function useTelemetryData({
  progress,
  allTimestamps,
  selectedOperationId,
}: Props) {
  const { telemetryData } = useData();
  const [currentData, setCurrentData] = useState<
    { flightId: string; status: Record<string, string | undefined> }[]
  >([]);

  useEffect(() => {
    if (!allTimestamps || allTimestamps.length === 0) return;

    const allStartTime = allTimestamps[0];
    const allEndTime = allTimestamps[allTimestamps.length - 1];
    const totalDuration = allEndTime - allStartTime;
    const currentTime = allStartTime + (totalDuration * progress) / 100;

    const updatedStatus = selectedOperationId.map((id) => {
      const latestPositionData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.POSITION,
        currentTime,
      );
      const latestGpsData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.GPS,
        currentTime,
      );
      const latestSpeedData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.SPEED,
        currentTime,
      );
      const latestAttitudeData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.ATTITUDE,
        currentTime,
      );
      const latestBatteryData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.BATTERY,
        currentTime,
      );
      const latestStatusData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.STATUS,
        currentTime,
      );

      if (!latestPositionData && !latestGpsData) {
        setCurrentData([]);
      }

      // 데이터 병합
      const mergedData: CombinedData = {
        lat: latestPositionData?.payload.lat * CONVERSION_FACTORS.LAT_LON,
        lon: latestPositionData?.payload.lon * CONVERSION_FACTORS.LAT_LON,
        alt: latestPositionData?.payload.alt * CONVERSION_FACTORS.ALTITUDE,
        heading: latestPositionData?.payload.hdg * CONVERSION_FACTORS.HEADING,

        speed: latestGpsData?.payload.vel,
        groundSpeed: latestSpeedData?.payload.groundspeed,
        roll: latestAttitudeData?.payload.roll,
        pitch: latestAttitudeData?.payload.pitch,
        yaw: latestAttitudeData?.payload.yaw,

        batteryRemaining: latestBatteryData?.payload.batteryRemaining,
        energyConsumed: latestBatteryData?.payload.energyConsumed,
        statusMessage: latestStatusData?.payload.text,
      };

      const formatData = (data: CombinedData) => ({
        lat: `${data.lat?.toFixed(4)}°`,
        lon: `${data.lon?.toFixed(4)}°`,
        alt: `${data.alt?.toFixed(2)}m`,
        heading: `${data.heading?.toFixed(2)}°`,
        speed: `${data.speed?.toFixed(2)}m/s`,
        groundSpeed: `${data.groundSpeed?.toFixed(2)}m/s`,
        roll: `${data.roll?.toFixed(2)} rad`,
        pitch: `${data.pitch?.toFixed(2)} rad`,
        yaw: `${data.yaw?.toFixed(2)} rad`,
        batteryRemaining:
          data.batteryRemaining !== undefined
            ? `${data.batteryRemaining}%`
            : undefined,
        energyConsumed:
          data.energyConsumed !== undefined
            ? `${data.energyConsumed}mWh`
            : undefined,
        statusMessage: data.statusMessage,
      });

      return { flightId: id, status: formatData(mergedData) };
    });

    setCurrentData(updatedStatus);
  }, [telemetryData, progress, allTimestamps]);

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
