import { fetchData } from "@/lib/fetchClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatTimestamp } from "@/utils/formatTimestamp";
import useData from "@/store/useData";

export default function Sidebar() {
  const {
    operationData,
    fetchOperationData,
    robotData,
    fetchRobotData,
    telemetryData,
    fetchTelemetryData,
    setSelectedOperation,
    toggleSelectedOperation,
  } = useData();
  const [operationTime, setOperationTime] = useState<Record<string, string>>(
    {},
  );
  const positionData = telemetryData[33] || [];

  useEffect(() => {
    fetchOperationData();
    fetchRobotData();
    fetchTelemetryData();
  }, []);

  useEffect(() => {
    // telemetryData에 기록이 있는 operation만 필터링
    const validOperations = operationData.filter((operation) => {
      return positionData.some(
        (telemetry) => telemetry.operation === operation._id,
      );
    });

    // 필터링된 operation의 운행시간
    const validTimeData = validOperations.reduce<{ [key: string]: string }>(
      (acc, value) => {
        const timestamp = formatTimestamp(getOperationTime(value["_id"]));
        acc[value._id] = timestamp;
        return acc;
      },
      {},
    );
    setOperationTime(validTimeData);
    setSelectedOperation(validTimeData);
  }, [operationData, telemetryData]);

  // 운행 시간 가져오기
  const getOperationTime = (operationId: string) => {
    const data = positionData.find((telemetry) => {
      return telemetry.operation === operationId;
    });
    return data ? data.timestamp : "No timestamp found";
  };

  const robotIds = [...new Set(operationData.map((value) => value["robot"]))];
  const robotNames = robotData.reduce(
    (acc, robot) => {
      acc[robot._id] = robot.name;
      return acc;
    },
    {} as Record<string, string>,
  );

  const isLoading = !(
    operationData.length > 0 &&
    robotNames &&
    positionData.length > 0
  );

  return (
    <aside className="flex h-[calc(100vh-56px)] w-60 flex-col gap-5 border-r bg-white p-4 text-lg">
      <div className="flex flex-col gap-5">
        <h2 className="font-bold">Pages</h2>
        <nav className="flex flex-col gap-5 pl-4">
          <Link href="/map" className="flex gap-4">
            <img src="/images/common/icon-map.svg" alt="Map page" />
            <span>Map</span>
          </Link>
          <Link href="/log" className="flex gap-4">
            <img src="/images/common/icon-pie-chart.svg" alt="Log page" />
            <span>LogPage</span>
          </Link>
        </nav>
      </div>
      <hr className="border-[#D9D9D9]" />
      {!isLoading ? (
        <div className="flex flex-col gap-5">
          <h2 className="font-bold">Operations</h2>
          {robotIds.map((value) => {
            return (
              <div key={value} className="flex flex-col gap-5">
                <div>{robotNames[value]}</div>
                {operationData.map((operation) => {
                  if (
                    operation["robot"] === value &&
                    operationTime[operation["_id"]]
                  ) {
                    return (
                      <div key={operation._id} className="flex flex-col pl-4">
                        <label className="flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="checkbox checkbox-sm"
                            onClick={() =>
                              toggleSelectedOperation(operation._id)
                            }
                          />
                          <span>{operationTime[operation._id]}</span>
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
