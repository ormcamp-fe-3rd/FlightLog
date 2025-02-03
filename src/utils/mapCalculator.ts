import { Telemetries } from "@/types/api";
import L from "leaflet";
import { formatTimestamp } from "@/utils/formatTimestamp";

export const mapCalculator = {
  // 운행별 위치 데이터 반환
  getOperationlatlings(operationId: string, positionData: Telemetries[]) {
    const result = positionData
      .filter((data) => data.operation === operationId)
      .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
      .map((data) => {
        const lat = data.payload.lat * 1e-7;
        const lon = data.payload.lon * 1e-7;
        return [lat, lon];
      });
    return result as [number, number][];
  },

  // 운행별 시간 데이터 반환
  getOperationTimes(operationId: string, positionData: Telemetries[]) {
    const result = positionData
      .filter((data) => data.operation === operationId)
      .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
      .map((data) => data.timestamp);
    return result;
  },

  // 운행별 시작 위치 반환
  getOperationStartPoint(operationId: string, positionData: Telemetries[]) {
    const data = positionData.find((data) => data.operation === operationId);
    if (!data) return null;

    const lat = data.payload.lat * 1e-7;
    const lon = data.payload.lon * 1e-7;
    return [lat, lon] as [number, number];
  },

  // 시간별 위치 데이터 계산
  calculateDronePosition(
    progress: number,
    positions: [number, number][],
    timestamps: number[],
  ): [number, number] {
    const totalDuration = timestamps[timestamps.length - 1] - timestamps[0];
    const currentTime = timestamps[0] + (totalDuration * progress) / 100;
    const index = timestamps.findIndex((timestamp) => timestamp >= currentTime);

    if (index === -1) {
      return positions[positions.length - 1];
    }
    if (index === 0) {
      return positions[0];
    }

    // 현재 시간에 대한 위치 계산 (선형 보간)
    const t0 = timestamps[index - 1];
    const t1 = timestamps[index];
    const ratio = (currentTime - t0) / (t1 - t0);

    const pos0 = positions[index - 1];
    const pos1 = positions[index];

    return [
      pos0[0] + (pos1[0] - pos0[0]) * ratio,
      pos0[1] + (pos1[1] - pos0[1]) * ratio,
    ];
  },

  // 방향 계산
  calculateDirection(
    progress: number,
    positions: [number, number][],
    timestamps: number[],
  ) {
    const totalDuration = timestamps[timestamps.length - 1] - timestamps[0];
    const currentTime = timestamps[0] + (totalDuration * progress) / 100;

    let index = -1;
    for (let i = 0; i < timestamps.length - 1; i++) {
      if (currentTime >= timestamps[i] && currentTime <= timestamps[i + 1]) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      return 0;
    }
    if (index === 0) {
      return 0;
    }

    const pos0 = positions[index];
    const pos1 = positions[index + 1];

    // 방향 계산: 두 위치 간의 방향 각도 계산
    const deltaY = pos1[0] - pos0[0];
    const deltaX = pos1[1] - pos0[1];
    const bearing = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    const droneHeading = (90 - bearing) % 360;

    return droneHeading < 0 ? droneHeading + 360 : droneHeading;
  },

  // 아이콘 생성
  createRotatedIcon(rotationAngle: number) {
    return L.divIcon({
      className: "",
      html: `
            <div 
              style="
                width: 30px; 
                height: 30px; 
                background: url('/images/map/marker-icon.png') no-repeat center/contain; 
                transform: rotate(${rotationAngle}deg);
                transition: transform 0.3s ease;
              ">
            </div>
          `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  },

  // 진행도별 시간 계산
  calculateCurrentTime(timestamps: number[], progress: number) {
    if (!timestamps) return null;
    const totalDuration = timestamps[timestamps.length - 1] - timestamps[0];
    const currentTime = timestamps[0] + (totalDuration * progress) / 100;
    const result = formatTimestamp(currentTime, "timestring");
    return result;
  },
};
