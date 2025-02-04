import calculateTimeByProgress from "./calculateTimeByProgress";
import { formatTimestamp } from "./formatTimestamp";

export default function isFlightActive(
  progress: number,
  allTimestamps: number[],
  operationTimestamps: Record<string, number[]>,
  selectedFlight: string,
) {
  if (!selectedFlight || !operationTimestamps[selectedFlight]?.length)
    return false;

  const timestamps = operationTimestamps[selectedFlight] ?? [];
  const { startTime, endTime } = getFlightTimeRane(timestamps);
  const currentTime = calculateTimeByProgress(allTimestamps, progress) ?? 0;

  const isTimeInRange = currentTime >= startTime && currentTime <= endTime;
  return isTimeInRange;
}

function getFlightTimeRane(timestamps: number[]) {
  const [firstTimestamp, lastTimestamp] = [
    timestamps[0],
    timestamps[timestamps.length - 1],
  ];

  return {
    startTime: formatTimestamp(firstTimestamp, "timestring"),
    endTime:
      formatTimestamp(lastTimestamp, "timestring").split(" ").pop() ?? "0",
  };
}
