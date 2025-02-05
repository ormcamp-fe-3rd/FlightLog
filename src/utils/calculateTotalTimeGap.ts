export default function calculateTotalTimeGap(allTimestamps: number[]) {
  if (allTimestamps.length === 0) return;

  const startTimestamp = allTimestamps[0];
  const endTimestamp = allTimestamps[allTimestamps.length - 1];
  const totalDuration = endTimestamp - startTimestamp;

  const totalSeconds = Math.floor(totalDuration / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  const formattedTime = `${String(totalHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    milliseconds: totalDuration,
    formattedTime: formattedTime,
  };
}
