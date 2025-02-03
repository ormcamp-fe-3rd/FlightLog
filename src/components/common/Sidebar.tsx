"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatTimestamp } from "@/utils/formatTimestamp";
import useData from "@/store/useData";
import { PAGES } from "@/constants";
import findOperationStartTime from "@/utils/findOperationStartTime";
import { getColorFromId } from "@/utils/getColorFromId";

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

  // 로딩 상태 관리 추가(사이드바에서만 사용돼서 따로 zustand로 분리하지는 않았습니다.)
  const [loadingOperations, setLoadingOperations] = useState<Set<string>>(
    new Set(),
  );

  // 로딩 완료된 상태 저장 추가
  const [loadedOperations, setLoadedOperations] = useState<Set<string>>(
    new Set(),
  );

  // 운행 정보를 최신 순으로 정렬하고 이를 상태로 관리
  const [sortedOperationData, setSortedOperationData] = useState(operationData);

  // 컴포넌트 마운트, 운행 정보가 변경될 때만 정렬
  useEffect(() => {
    const sorted = [...operationData].sort((a, b) => {
      const timeA = validOperationLabels[a._id] || "";
      const timeB = validOperationLabels[b._id] || "";
      return timeA.localeCompare(timeB);
    });
    setSortedOperationData(sorted);
  }, [operationData, validOperationLabels]);

  const handleOperationToggle = (operationId: string) => {
    if (
      !selectedOperationId.includes(operationId) &&
      !loadedOperations.has(operationId)
    ) {
      setLoadingOperations((prev) => new Set([...prev, operationId]));
    }
    toggleSelectedOperation(operationId);
  };

  // telemetryData 업데이트 시 로딩 제거하면서 loadedOperations에 로딩 완료 상태를 저장
  useEffect(() => {
    setLoadingOperations((prev) => {
      const newLoading = new Set(prev);
      for (const operation of prev) {
        if (telemetryData[33]?.some((t) => t.operation === operation)) {
          newLoading.delete(operation);
          setLoadedOperations((loaded) => new Set([...loaded, operation]));
        }
      }
      return newLoading;
    });
  }, [telemetryData]);

  useEffect(() => {
    if (
      positionData.length === 0 ||
      Object.keys(validOperationLabels).length > 0
    )
      return;

    const validOperations = operationData.filter((operation) => {
      return positionData.some(
        (telemetry) => telemetry.operation === operation._id,
      );
    });
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

  //운행정보 토글 매뉴
  const [toggleLabel, setToggleLabel] = useState<Set<string>>(new Set());
  const robotIds = [
    ...new Set(
      operationData
        .sort((a, b) => a.robot.localeCompare(b.robot))
        .map((value) => value["robot"]),
    ),
  ];
  const robotNames = robotData.reduce(
    (acc, robot) => {
      acc[robot._id] = robot.name;
      return acc;
    },
    {} as Record<string, string>,
  );

  // 수정: 라벨당 텔레메트리 데이터를 한 개씩 먼저 받아와 라벨링 작업을 하도록 함
  const isLoading = !(operationData.length > 0 && robotNames);

  const toggleRobot = (robotId: string) => {
    setToggleLabel((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(robotId)) {
        newSet.delete(robotId);
      } else {
        newSet.add(robotId);
      }
      return newSet;
    });
  };

  return (
    <aside className="flex h-[calc(100vh-56px)] w-72 flex-col gap-5 border-r bg-white p-4 text-lg">
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
              <div
                key={robotId}
                className="collapse collapse-arrow bg-base-200"
              >
                <input
                  type="checkbox"
                  checked={toggleLabel.has(robotId)}
                  onChange={() => toggleRobot(robotId)}
                />
                <div className="collapse-title font-medium">
                  {robotNames[robotId]}
                </div>
                <div className="collapse-content">
                  {sortedOperationData.map((operation) => {
                    if (operation["robot"] === robotId) {
                      return (
                        <div key={operation._id} className="flex flex-col py-1">
                          <label className="flex h-6 cursor-pointer items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedOperationId.includes(
                                operation._id,
                              )}
                              className="checkbox checkbox-sm bg-gray-300"
                              onChange={() =>
                                handleOperationToggle(operation._id)
                              }
                            />
                            {selectedOperationId.includes(operation._id) &&
                            loadingOperations.has(operation._id) ? (
                              <div className="flex items-center gap-2">
                                <span className="loading loading-spinner loading-sm"></span>
                                <span className="text-gray-600">
                                  데이터 로딩중...
                                </span>
                              </div>
                            ) : (
                              <span>
                                {validOperationLabels[operation._id] || (
                                  <span className="text-gray-500">
                                    데이터 없음
                                  </span>
                                )}
                              </span>
                            )}
                            {/* 컬러 라벨 */}
                            <span
                              className="size-2 rounded-full"
                              style={{
                                backgroundColor: getColorFromId(operation._id),
                              }}
                            />
                          </label>
                        </div>
                      );
                    }
                  })}
                </div>
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
