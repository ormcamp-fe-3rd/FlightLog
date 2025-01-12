export async function fetchData(
  url: string,
  params: Record<string, string> = {},
) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${url}?${queryString}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
}
