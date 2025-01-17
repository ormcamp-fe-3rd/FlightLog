export async function fetchData(
  collectionName: string,
  query: Record<string, string> = {},
) {
  const queryString = new URLSearchParams(query).toString();
  const url = `/api/${collectionName}?${queryString}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
}
