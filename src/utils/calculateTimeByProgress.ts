import { formatTimestamp } from "./formatTimestamp";

export default function calculateTimeByProgress(
  timestamps: number[],
  progress: number,
) {
  if (!timestamps) return null;
  const totalDuration = timestamps[timestamps.length - 1] - timestamps[0];
  const currentTime = timestamps[0] + (totalDuration * progress) / 100;
  const result = formatTimestamp(currentTime, "timestring");
  if (result === "Invalid Date") return;

  return result;
}
