import calculateTimeByProgress from "./calculateTimeByProgress";
import { formatTimestamp } from "./formatTimestamp";

export default function isFlightActive(
  progress: number,
  allTimestamps: number[],
  operationTimestamps: Record<string, number[]>,
  selectedFlight: string,
) {
  const timestamps = operationTimestamps[selectedFlight] ?? [];
  const startTime = formatTimestamp(timestamps[0], "timestring") ?? 0;
  const endTime =
    formatTimestamp(timestamps[timestamps.length - 1], "timestring")
      .split(" ")
      .pop() ?? 0;
  const currentTime = calculateTimeByProgress(allTimestamps, progress) ?? 0;

  const isTimeInRange = currentTime >= startTime && currentTime <= endTime;

  return isTimeInRange;
}
