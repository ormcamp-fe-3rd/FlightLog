export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  // 원하는 형식으로 날짜와 시간을 포맷
  const formattedDate = date
    .toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24시간 형식
    })
    .replace(/\//g, "-")
    .replace(",", "");

  return formattedDate;
}
