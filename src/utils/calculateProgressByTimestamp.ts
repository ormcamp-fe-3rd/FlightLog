export default function calculateProgressByTimestamp(
  timestamps: number[],
  currentTime: number,
) {
  if (timestamps.length === 0) return 0;

  const totalDuration = timestamps[timestamps.length - 1] - timestamps[0];
  const elapsed = currentTime - timestamps[0];
  return Math.min((elapsed / totalDuration) * 100, 100);
}
