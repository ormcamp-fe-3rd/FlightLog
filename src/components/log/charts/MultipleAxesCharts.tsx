"use client";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import useData from "@/store/useData";

export default function DroneCharts() {
  const { telemetryData, selectedOperationId } = useData();
  const positionData = telemetryData[33] || [];

  const filteredData = positionData.filter((telemetry) =>
    selectedOperationId.includes(telemetry.operation),
  );

  const seriesDroneData = selectedOperationId.map((operationId) => {
    const operationData = filteredData.filter(
      (telemetry) => telemetry.operation === operationId,
    );

    return {
      name: `${operationId}`,

      data: operationData.map((droneLog) => ({
        x: new Date(droneLog.timestamp).getTime(),
        y: droneLog.payload.alt,
      })),
    };
  });

  const options = {
    chart: {
      // zooming: {
      //   type: "xy",
      // }, //마우스 드래그로 클릭
      height: 400,
      width: 1200,
    },
    title: {
      text: "드론 고도 데이터",
    },

    xAxis: [
      {
        categories: [],
      },
    ],

    yAxis: [
      {
        labels: {
          format: "{value}m",
        },
        title: {
          text: "alt",
        },
        opposite: true,
      },
    ],

    // 전역 데이터
    series: seriesDroneData,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
