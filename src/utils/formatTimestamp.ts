/**
 * ISO 8601 형식의 타임스탬프 문자열을 한국시각으로 변환
 *
 * @param {string} timestamp - ISO 8601 형식의 타임스탬프 문자열
 * @returns {string} "YYYY. MM. DD. HH:mm" 형식의 한국 시각 (유효하지 않은 타임스탬프가 전달되면 "Invalid Date" 반환)
 */

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

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
