export const getSatellites = (telemetryData: any, operationId: string) => {
  const satelitesData = telemetryData[24] || [];
  return satelitesData
    .filter((data: any) => data.operation === operationId)
    .map((data: any) => [data.payload.satellitesVisible]) as [number][];
};

export const getPosition = (telemetryData: any, operationId: string) => {
  const positionData = telemetryData[33] || [];
  return positionData
    .filter((data: any) => data.operation === operationId)
    .map((data: any) => {
      const lat = data.payload.lat * 1e-7;
      const lon = data.payload.lon * 1e-7;
      return [lat, lon];
    }) as [number, number][];
};

export const getBattery = (telemetryData: any, operationId: string) => {
  const BatteryData = telemetryData[147] || [];
  return BatteryData.filter((data: any) => data.operation === operationId).map(
    (data: any) => {
      const temperature = data.payload.temperature;
      const voltages = data.payload.voltages;
      const battery_remaining = data.payload.battery_remaining;
      return [temperature, voltages, battery_remaining];
    },
  ) as [number, number, number][];
};
