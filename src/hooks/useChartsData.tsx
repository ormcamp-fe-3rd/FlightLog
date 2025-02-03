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

export const getSpeed = (telemetryData: any, operationId: string[]) => {
  const SpeedData = telemetryData[74] || [];
  return SpeedData.filter((data: any) =>
    operationId.includes(data.operation),
  ).map((data: any) => {
    const id = data.operation;
    const speed = data.payload.groundspeed;
    const alt = data.payload.alt * 1e-7; // altitude
    const timestamp = data.timestamp;
    return [id, speed, alt, timestamp];
  }) as [number, number, number, number][];
};

export const groupDataById = (data: any[]) => {
  const groupData: Record<string, any[]> = {};

  // 데이터를 분류
  data.forEach((item) => {
    const id = item[2];
    if (!groupData[id]) {
      groupData[id] = [];
    }
    groupData[id].push(item);
  });
  return groupData;
};
