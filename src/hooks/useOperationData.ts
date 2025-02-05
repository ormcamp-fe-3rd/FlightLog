import useData from "@/store/useData";
import { mapCalculator } from "@/utils/mapCalculator";
import { useMemo } from "react";

export default function useOperationData() {
  const { telemetryData, selectedOperationId } = useData();
  return useMemo(() => {
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
        const startPoint = mapCalculator.getOperationStartPoint(
          id,
          positionData,
        );
        if (startPoint) {
          acc[id] = startPoint;
        }
        return acc;
      },
      {} as Record<string, [number, number]>,
    );

    return {
      updatedLatlngs,
      updatedTimestamps,
      updatedStartPoint,
    };
  }, [telemetryData, selectedOperationId]);
}
