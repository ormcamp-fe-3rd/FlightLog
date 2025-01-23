import { CONVERSION_FACTORS, TELEMETRY_MSGID } from "@/constants";
import useData from "@/store/useData";
import { Telemetries } from "@/types/api";
import { useEffect, useState } from "react";

interface CombinedData {
  lat?: number;
  lon?: number;
  alt?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  heading?: number; // 진행 방향
  altEllipsoid?: number; // 엘리포이드 고도
  speed?: number;
  groundSpeed?: number; // 지면 속도
  climb?: number; // 상승 속도
  roll?: number; // 롤 각도
  pitch?: number; // 피치 각도
  yaw?: number; // 요 각도
  rollSpeed: number;
  pitchSpeed: number;
  yawSpeed: number;
  temperature?: number;
  batteryRemaining?: number; // 배터리 잔량
  energyConsumed?: number; // 소비된 에너지
  statusMessage?: string; // 상태 메시지
  flightTime?: number; // 비행 시간
}

interface Props {
  progress: number;
  allTimestamps: number[];
  operationTimestamps: Record<string, number[]>;
  selectedOperationId: string[];
}

export function useTelemetryData({
  progress,
  allTimestamps,
  operationTimestamps,
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
      const operationTime = operationTimestamps[id];
      if (!operationTime || operationTime.length === 0)
        return { flightId: id, status: {} };

      const operationStartTime = operationTime[0];
      const operationEndTime = operationTime[operationTime.length - 1];
      if (currentTime > operationEndTime) {
        return { flightId: id, status: {} };
      }

      const latestPositionData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.POSITION,
        operationStartTime,
        operationEndTime,
        currentTime,
      );
      const latestGpsData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.GPS,
        operationStartTime,
        operationEndTime,
        currentTime,
      );
      const latestSpeedData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.SPEED,
        operationStartTime,
        operationEndTime,
        currentTime,
      );
      const latestAttitudeData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.ATTITUDE,
        operationStartTime,
        operationEndTime,
        currentTime,
      );
      const latestBatteryData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.BATTERY,
        operationStartTime,
        operationEndTime,
        currentTime,
      );
      const latestStatusData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.STATUS,
        operationStartTime,
        operationEndTime,
        currentTime,
      );

      if (
        !latestPositionData &&
        !latestGpsData &&
        !latestSpeedData &&
        !latestAttitudeData &&
        !latestBatteryData &&
        !latestStatusData
      ) {
        return { flightId: id, status: {} };
      }

      // 데이터 병합
      const mergedData: CombinedData = {
        lat: latestPositionData?.payload.lat * CONVERSION_FACTORS.LAT_LON,
        lon: latestPositionData?.payload.lon * CONVERSION_FACTORS.LAT_LON,
        alt: latestPositionData?.payload.alt * CONVERSION_FACTORS.ALTITUDE,
        vx: latestPositionData?.payload.vx,
        vy: latestPositionData?.payload.vy,
        vz: latestPositionData?.payload.vz,
        heading: latestPositionData?.payload.hdg * CONVERSION_FACTORS.HEADING,
        altEllipsoid:
          latestGpsData?.payload.altEllipsoid *
          CONVERSION_FACTORS.ALT_ELLIPSOID,
        speed: latestGpsData?.payload.vel,
        groundSpeed: latestSpeedData?.payload.groundspeed,
        climb: latestSpeedData?.payload.climb * 100,
        roll: latestAttitudeData?.payload.roll,
        pitch: latestAttitudeData?.payload.pitch,
        yaw: latestAttitudeData?.payload.yaw,
        rollSpeed:
          latestAttitudeData?.payload.rollspeed * CONVERSION_FACTORS.RAD_TO_DEG,
        pitchSpeed:
          latestAttitudeData?.payload.pitchspeed *
          CONVERSION_FACTORS.RAD_TO_DEG,
        yawSpeed:
          latestAttitudeData?.payload.yawspeed * CONVERSION_FACTORS.RAD_TO_DEG,
        temperature:
          latestBatteryData?.payload.temperature *
          CONVERSION_FACTORS.TEMPERATURE,
        batteryRemaining:
          latestBatteryData?.payload.batteryRemaining *
          CONVERSION_FACTORS.BATTERY_REMAINING,
        energyConsumed: latestBatteryData?.payload.energyConsumed,
        statusMessage: latestStatusData?.payload.text,
        flightTime: operationEndTime - operationStartTime,
      };

      const formatData = (data: CombinedData) => ({
        lat: formatValue(data.lat, 4, "°"),
        lon: formatValue(data.lon, 4, "°"),
        alt: formatValue(data.alt, 2, "m"),
        vx: formatValue(data.vx, 2, "m/s"),
        vy: formatValue(data.vy, 2, "m/s"),
        vz: formatValue(data.vz, 2, "m/s"),
        heading: formatValue(data.heading, 2, "°"),
        altEllipsoid: formatValue(data.altEllipsoid, 2, "m"),
        speed: formatValue(data.speed, 2, "m/s"),
        groundSpeed: formatValue(data.groundSpeed, 2, "m/s"),
        climb: formatValue(data.climb, 2, " cm/s"),
        roll: formatValue(data.roll, 2, " rad"),
        pitch: formatValue(data.pitch, 2, " rad"),
        yaw: formatValue(data.yaw, 2, " rad"),
        rollSpeed: formatValue(data.rollSpeed, 4, " °/s"),
        pitchSpeed: formatValue(data.pitchSpeed, 4, " °/s"),
        yawSpeed: formatValue(data.yawSpeed, 4, " °/s"),
        temperature: formatValue(data.temperature, 1, "°C"),
        batteryRemaining: formatValue(data.batteryRemaining, 2, "%"),
        energyConsumed: formatValue(data.energyConsumed, 0, "mWh"),
        statusMessage: data.statusMessage,
        flightTime: formatFlightTime(data.flightTime),
      });

      return { flightId: id, status: formatData(mergedData) };
    });

    setCurrentData(updatedStatus);
  }, [telemetryData, progress, allTimestamps, operationTimestamps]);

  return currentData;
}

const getLatestData = (
  telemetryData: { [key: string]: Telemetries[] },
  id: number,
  startTime: number,
  endTime: number,
  currentTime: number,
) => {
  const filteredData = telemetryData[id]
    ?.map((data) => ({
      ...data,
      timestamp: Date.parse(data.timestamp),
    }))
    .filter(
      (data) =>
        data.timestamp >= startTime &&
        data.timestamp <= endTime &&
        data.timestamp <= currentTime,
    );

  return filteredData?.[filteredData.length - 1] ?? null;
};

const formatValue = (
  value: number | undefined,
  decimals: number,
  unit: string,
) => {
  if (value === undefined || isNaN(value)) return "-";
  return `${value.toFixed(decimals)}${unit}`;
};

const formatFlightTime = (flightTime: number | undefined) => {
  if (flightTime === undefined || isNaN(flightTime)) return "-";

  const totalSeconds = flightTime / 1000;

  const hours = Math.floor(totalSeconds / 3600); // 전체 초를 3600으로 나누어 시간 계산
  const minutes = Math.floor((totalSeconds % 3600) / 60); // 남은 초에서 분 계산
  const seconds = totalSeconds % 60; // 나머지 초 계산

  // 00:00 형식으로 변환
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds.toFixed(0)).padStart(2, "0")}`;
};
