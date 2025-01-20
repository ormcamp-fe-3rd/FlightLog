"use client";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import useData from "@/store/useData";

export default function BatteryStatusChart() {
  const { telemetryData, selectedOperationId, validOperationLabels } =
    useData();
  const batteryData = telemetryData[147] || []; // msgId 147 (BATTERY_STATUS)

  // 선택된 운행의 배터리 정보만 필터링
  const filteredBatteryData = batteryData
    .filter((data: any) => selectedOperationId.includes(data.operation))
    .map((data: any) => ({
      operationLabel: validOperationLabels[data.operation],
      timestamp: new Date(data.timestamp),
      temperature: data.payload.temperature,
      voltages: data.payload.voltages[0],
      batteryRemaining: data.payload.batteryRemaining,
    }));

  console.log(selectedOperationId.map((id) => validOperationLabels[id]));

  const options = {
    chart: {
      // zooming: {
      //   type: "xy",
      // },
      height: 400,
      width: 1200,
    },
    title: {
      text: "드론 배터리 데이터",
    },

    xAxis: [
      {
        categories: [],
        crosshair: true, //마우스 호버시 시각적 가이드 제공 기능
      },
    ],
    yAxis: [
      {
        title: {
          text: "배터리 잔량 (%)",
        },
        labels: {
          format: "{value}%",
        },
        min: 0,
        max: 100,
      },
      {
        labels: {
          format: "{value}°C",
        },
        title: {
          text: "온도 (°C)",
        },
        opposite: true,
      },
      {
        title: {
          text: "전압 (V)",
        },
        labels: {
          format: "{value}V",
        },
        opposite: true,
      },
    ],

    // 하드코딩 데이터에서 전역 데이터로 변환
    series: [
      {
        name: "배터리 잔량",
        type: "column",
        yAxis: 0,
        data: filteredBatteryData.map((data) => data.batteryRemaining),
        tooltip: {
          valueSuffix: " %",
        },
      },
      {
        name: "배터리 온도",
        type: "spline",
        yAxis: 1,
        data: filteredBatteryData.map((data) => data.temperature),
        tooltip: {
          valueSuffix: " °C",
        },
      },
      {
        name: "배터리 전압",
        type: "spline",
        yAxis: 2,
        data: filteredBatteryData.map((data) => data.voltages),
        marker: {
          enabled: false,
        },
        dashStyle: "shortdot",
        tooltip: {
          valueSuffix: " V",
        },
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
