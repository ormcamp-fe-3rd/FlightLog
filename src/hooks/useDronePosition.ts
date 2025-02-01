import useData from "@/store/useData";
import { mapCalculator } from "@/utils/mapCalculator";
import { useMemo } from "react";

export default function useDronePosition(
  progress: number,
  allTimestamps: number[],
  operationTimestamps: Record<string, number[]>,
  operationLatlngs: Record<string, [number, number][]>,
) {
  const { selectedOperationId } = useData();
  return useMemo(() => {
    if (!allTimestamps || allTimestamps.length < 2) return [];

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

    return updatedPositions;
  }, [progress, allTimestamps, operationTimestamps, operationLatlngs]);
}
