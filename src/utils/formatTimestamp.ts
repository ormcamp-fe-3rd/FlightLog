/**
 * ISO 8601 형식의 타임스탬프 문자열을 한국시각으로 변환
 *
 * @param {string | number} timestamp - ISO 8601 형식의 타임스탬프 문자열/숫자
 * @param {string} type - "default" 또는 "timestring"을 선택하여 출력 형식 지정
 * @returns {string} 지정된 형식에 맞는 한국 시각 문자열
 *   - "default" : "YYYY-MM-DD HH:mm"
 *   - "timestring" : "HH:mm:ss"
 *   - 유효하지 않은 타임스탬프가 전달되면 "Invalid Date" 반환
 */

export function formatTimestamp(
  timestamp: string | number,
  type: "default" | "timestring" = "default",
): string {
  const date = new Date(timestamp);

  if (type === "default") {
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

  if (type === "timestring") {
    const timestring = date.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 24시간 형식
    });
    return timestring;
  }

  return "Invalid Date"; // 예상치 못한 경우
}
