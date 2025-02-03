export const getStatus = (telemetryData: any, operationId: string[]) => {
  const attitudesData = telemetryData[30] || [];
  return attitudesData
    .filter((data: any) => operationId.includes(data.operation))
    .map((data: any) => {
      const id = data.operation;
      const roll = data.payload.roll;
      const pitch = data.payload.pitch;
      const yaw = data.payload.yaw;
      const timestamp = data.timestamp;
      return [id, roll, pitch, yaw, timestamp];
    }) as [number, number, number, number, number][];
};

export const getAltitude = (telemetryData: any, operationId: string[]) => {
  const Altitude = telemetryData[33] || [];
  return Altitude.filter((data: any) =>
    operationId.includes(data.operation),
  ).map((data: any) => {
    const id = data.operation;
    const alt = data.payload.alt * 1e-7; // altitude
    const timestamp = data.timestamp;
    return [id, alt, timestamp];
  }) as [number, number, number][];
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
