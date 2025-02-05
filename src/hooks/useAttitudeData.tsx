import { CONVERSION_FACTORS, TELEMETRY_MSGID } from "@/constants";
import useData from "@/store/useData";
import { Telemetries } from "@/types/api";
import { useEffect, useState } from "react";

interface CombinedData {
  heading?: number; // 진행 방향
  roll?: number; // 롤 각도
  pitch?: number; // 피치 각도
  yaw?: number; // 요 각도
  rollSpeed: number;
  pitchSpeed: number;
  yawSpeed: number;
}

interface Props {
  progress: number;
  allTimestamps: number[];
  operationTimestamps: Record<string, number[]>;
  selectedOperationId: string[];
}

export function useAttitudeData({
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
      const latestAttitudeData = getLatestData(
        telemetryData,
        TELEMETRY_MSGID.ATTITUDE,
        operationStartTime,
        operationEndTime,
        currentTime,
      );

      if (!latestPositionData && !latestAttitudeData) {
        return { flightId: id, status: {} };
      }

      // 데이터 병합
      const mergedData: CombinedData = {
        heading: latestPositionData?.payload.hdg * CONVERSION_FACTORS.HEADING,
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
      };

      const formatData = (data: CombinedData) => ({
        heading: formatValue(data.heading, 2),
        roll: formatValue(data.roll, 2),
        pitch: formatValue(data.pitch, 2),
        yaw: formatValue(data.yaw, 2),
        rollSpeed: formatValue(data.rollSpeed, 4),
        pitchSpeed: formatValue(data.pitchSpeed, 4),
        yawSpeed: formatValue(data.yawSpeed, 4),
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

const formatValue = (value: number | undefined, decimals: number) => {
  if (value === undefined || isNaN(value)) return;
  return value.toFixed(decimals);
};
