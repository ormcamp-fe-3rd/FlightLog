export const getStatus = (
  telemetryData: any,
  operationId: string[],
  sampleInterval: number = 10,
) => {
  const attitudesData = telemetryData?.[30];
  if (!attitudesData) return [];

  return attitudesData
    .filter(
      (data: any, index: number) =>
        operationId.includes(data.operation) && index % sampleInterval === 0,
    )
    .map((data: any) => {
      const id = data.operation;
      const roll = data.payload.roll;
      const pitch = data.payload.pitch;
      const yaw = data.payload.yaw;
      const timestamp = data.timestamp;
      return [id, roll, pitch, yaw, timestamp];
    }) as [number, number, number, number, number][];
};

export const getAltitude = (
  telemetryData: any,
  operationId: string[],
  sampleInterval: number = 10,
) => {
  const AltitudeData = telemetryData?.[74];
  if (!AltitudeData) return [];
  return AltitudeData.filter(
    (data: any, index: number) =>
      operationId.includes(data.operation) && index % sampleInterval === 0,
  ).map((data: any) => {
    const id = data.operation;
    const speed = data.payload.groundspeed;
    const alt = data.payload.alt; // altitude
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

// export const getBattery = (telemetryData: any, operationId: string[]) => {
//   const BatteryData = telemetryData?.[147];
//   if (!BatteryData) return [];
//   return BatteryData.filter((data: any) =>
//     operationId.includes(data.operation),
//   ).map((data: any) => {
//     const temperature = data.payload.temperature;
//     const voltages = data.payload.voltages;
//     const battery_remaining = data.payload.batteryRemaining;
//     const timestamp = data.timestamp;
//     return [temperature, voltages, battery_remaining, timestamp];
//   }) as [number, number, number, number][];
// };
