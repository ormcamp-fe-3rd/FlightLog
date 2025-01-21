"use client";

import { useTelemetryData } from "@/hooks/useTelemetryData";

interface StatusPanelProps {
  progress: number;
  selectedTimestamp: number[];
  selectedOperationId: string[];
  selectedFlight: string;
}

export default function StatusPanel({
  progress,
  selectedTimestamp,
  selectedOperationId,
  selectedFlight,
}: StatusPanelProps) {
  const currentData = useTelemetryData({
    progress,
    selectedTimestamp,
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
          <div>GPS 정보</div>
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
          <img src="/images/map/icon-Flight.svg" alt="Flight info" />
          <div>비행 정보</div>
        </div>
        <div className="flex">
          <div className="flex-1">
            <div>속도</div>
            <div>{statusData?.speed}</div>
          </div>
          <div className="flex-1">
            <div>방향</div>
            <div>{statusData?.heading}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <img src="/images/map/icon-Altitude.svg" alt="Altitude" />
          <div>고도 정보</div>
        </div>
        <div className="flex">
          <div className="flex-1">
            <div>고도</div>
            <div>{statusData?.alt}</div>
          </div>
          <div className="flex-1">
            <div>상대 고도</div>
            <div>{statusData?.relativeAlt}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <img src="/images/map/icon-Accuracy.svg" alt="Accuracy" />
          <div>정확도</div>
        </div>
        <div className="flex">
          <div className="flex-1">
            <div>수평 정확도</div>
            <div>{statusData?.hAcc}</div>
          </div>
          <div className="flex-1">
            <div>수직 정확도</div>
            <div>{statusData?.vAcc}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
