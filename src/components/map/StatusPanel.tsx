"use client";

import { useTelemetryData } from "@/hooks/useTelemetryData";

interface StatusPanelProps {
  progress: number;
  allTimestamps: number[];
  operationTimestamps: Record<string, number[]>;
  selectedOperationId: string[];
  selectedFlight: string;
}

export default function StatusPanel({
  progress,
  allTimestamps,
  operationTimestamps,
  selectedOperationId,
  selectedFlight,
}: StatusPanelProps) {
  const currentData = useTelemetryData({
    progress,
    allTimestamps,
    operationTimestamps,
    selectedOperationId,
  });

  const filteredData = currentData.filter(
    (data) => data.flightId === selectedFlight,
  );
  const statusData = filteredData.length > 0 ? filteredData[0].status : null;

  return (
    <div className="flex max-h-full w-[280px] flex-col gap-6 overflow-y-scroll rounded-[30px] bg-black py-6 pl-10 text-white opacity-80">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <img src="/images/map/icon-GPS.svg"></img>
          <div>위치 정보</div>
        </div>
        <div className="flex">
          <div className="flex-1">
            <div>위도</div>
            <div>{statusData?.lat}</div>
          </div>
          <div className="flex-1">
            <div>경도</div>
            <div>{statusData?.lon}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <img src="/images/map/icon-Altitude.svg" alt="Altitude" />
          <div>비행 정보</div>
        </div>
        <div className="flex">
          <div className="flex-1">
            <div>고도</div>
            <div>{statusData?.alt}</div>
          </div>
          <div className="flex-1">
            <div>속도</div>
            <div>{statusData?.groundSpeed}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <img src="/images/map/icon-Flight.svg" alt="Flight info" />
          <div>기기 정보</div>
        </div>
        <div className="flex">
          <div className="flex-1">
            <div>방향</div>
            <div>{statusData?.heading}</div>
          </div>
          <div className="flex-1">
            <div>배터리 잔량</div>
            <div>{statusData?.batteryRemaining}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <img src="/images/map/icon-Accuracy.svg" alt="Accuracy" />
          <div>기타</div>
        </div>
      </div>
    </div>
  );
}
