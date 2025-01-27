// 캐시를 저장할 맵 객체 생성
const cache = new Map<string, Promise<any>>();

export async function fetchData(
  collectionName: string,
  query: Record<string, string> = {},
) {
  const queryString = new URLSearchParams(query).toString();
  const url = `/api/${collectionName}?${queryString}`;

  // 캐시 키 생성
  const cacheKey = url;

  // 캐시된 결과가 있다면 반환
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // 새로운 요청을 생성하고 캐시에 저장
  const fetchPromise = fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

  cache.set(cacheKey, fetchPromise);
  return fetchPromise;
}
