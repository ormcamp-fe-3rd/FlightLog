export const getSatellites = (telemetryData: any, operationId: string[]) => {
  const satelitesData = telemetryData[24] || [];
  return satelitesData
    .filter((data: any) => operationId.includes(data.operation))
    .map((data: any) => {
      const id = data.operation;
      const satelitesCount = data.payload.satellitesVisible;
      const timestamp = data.timestamp;
      return [id, satelitesCount, timestamp];
    }) as [number, number, number][];
};

export const getPosition = (telemetryData: any, operationId: string[]) => {
  const positionData = telemetryData[33] || [];
  return positionData
    .filter((data: any) => operationId.includes(data.operation))
    .map((data: any) => {
      const id = data.operation;
      const lat = data.payload.lat * 1e-7;
      const lon = data.payload.lon * 1e-7;
      const alt = data.payload.alt * 1e-7;
      const timestamp = data.timestamp;
      return [id, lat, lon, alt, timestamp];
    }) as [number, number, number, number, number][];
};

export const getBattery = (telemetryData: any, operationId: string[]) => {
  const BatteryData = telemetryData[147] || [];
  return BatteryData.filter((data: any) =>
    operationId.includes(data.operation),
  ).map((data: any) => {
    const temperature = data.payload.temperature;
    const voltages = data.payload.voltages;
    const battery_remaining = data.payload.batteryRemaining;
    const timestamp = data.timestamp;
    return [temperature, voltages, battery_remaining, timestamp];
  }) as [number, number, number, number][];
};
