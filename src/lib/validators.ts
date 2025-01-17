export default function isValidCollectionName(name: string): boolean {
  // 알파벳, 숫자, 언더스코어만 포함
  const validNamePattern = /^[a-zA-Z0-9_]+$/;

  // 타입, 길이 제한
  if (!name || typeof name !== "string" || name.length > 50) {
    return false;
  }

  return validNamePattern.test(name);
}
