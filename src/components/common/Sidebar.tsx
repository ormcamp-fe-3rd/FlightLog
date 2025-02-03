"use client";

import Link from "next/link";
import { useEffect } from "react";
import { formatTimestamp } from "@/utils/formatTimestamp";
import useData from "@/store/useData";
import { PAGES } from "@/constants";
import findOperationStartTime from "@/utils/findOperationStartTime";

export default function Sidebar() {
  const {
    operationData,
    robotData,
    telemetryData,
    validOperationLabels,
    setValidOperationLabel,
    toggleSelectedOperation,
    selectedOperationId,
  } = useData();
  const positionData = telemetryData[33] || [];

  const robotIds = [...new Set(operationData.map((value) => value["robot"]))];
  const robotNames = robotData.reduce(
    (acc, robot) => {
      acc[robot._id] = robot.name;
      return acc;
    },
    {} as Record<string, string>,
  );

  // 수정: 텔레메트리 데이터(positionData) 없이도 기본 UI를 로드하도록 변경
  const isLoading = !(operationData.length > 0 && robotNames);

  useEffect(() => {
    // -> 기본 UI, 체크 박스를 일단 표시, timestamp는 아직 계산하지 않음
    if (positionData.length === 0) return;

    const validOperations = operationData.filter((operation) => {
      return positionData.some(
        (telemetry) => telemetry.operation === operation._id,
      );
    });
    // 필터링된 operation의 라벨(운행 시작시간)
    const validOperationLabel = validOperations.reduce<{
      [key: string]: string;
    }>((acc, value) => {
      const timestamp = findOperationStartTime(value["_id"], positionData);
      if (timestamp !== "No timestamp found") {
        acc[value._id] = formatTimestamp(timestamp);
      }
      return acc;
    }, {});

    setValidOperationLabel(validOperationLabel);
  }, [operationData, telemetryData]);

  return (
    <aside className="flex h-[calc(100vh-56px)] w-60 flex-col gap-5 border-r bg-white p-4 text-lg">
      <div className="flex flex-col gap-5">
        <h2 className="font-bold">Pages</h2>
        <nav className="flex flex-col gap-5 pl-4">
          {PAGES.map((page) => (
            <Link href={page.id} key={page.id} className="flex gap-4">
              <img src={page.icon} alt={page.title} />
              <span>{page.title}</span>
            </Link>
          ))}
        </nav>
      </div>
      <hr className="border-[#D9D9D9]" />
      {!isLoading ? (
        <div className="flex flex-col gap-5">
          <h2 className="font-bold">Operations</h2>
          {robotIds.map((robotId) => {
            return (
              <div key={robotId} className="flex flex-col gap-5">
                <div>{robotNames[robotId]}</div>
                {operationData.map((operation) => {
                  // 수정: 모든 operation 표시
                  if (operation["robot"] === robotId) {
                    return (
                      <div key={operation._id} className="flex flex-col pl-4">
                        <label className="flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedOperationId.includes(
                              operation._id,
                            )}
                            className="checkbox checkbox-sm"
                            onChange={() =>
                              toggleSelectedOperation(operation._id)
                            }
                          />
                          <span>
                            {validOperationLabels[operation._id]
                              ? validOperationLabels[operation._id]
                              : "데이터 로딩 중..."}
                          </span>
                        </label>
                      </div>
                    );
                  }
                })}
              </div>
            );
          })}
        </div>
      ) : (
        "Loading..."
      )}
    </aside>
  );
}
