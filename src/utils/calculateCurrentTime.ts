import { formatTimeString } from "./formatTimestamp";

export default function calculateCurrentTime(
  timestamps: number[],
  progress: number,
) {
  if (!timestamps) return null;
  const totalDuration = timestamps[timestamps.length - 1] - timestamps[0];
  const currentTime = timestamps[0] + (totalDuration * progress) / 100;
  const result = formatTimeString(currentTime);
  if (result === "Invalid Date") return;

  return result;
}
