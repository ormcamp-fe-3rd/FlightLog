"use client";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useData from "@/store/useData";
import { getBattery } from "@/hooks/useChartsData";

export default function BatteryStatusChart() {
  const { telemetryData, selectedOperationId, validOperationLabels } =
    useData();

  const batteryData = getBattery(telemetryData, selectedOperationId).map(
    (data) => ({
      temperature: data[0],
      voltages: data[1],
      batteryRemaining: data[2],
      timestamp: new Date(data[3]),
    }),
  );

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
        crosshair: true,
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

    series: [
      {
        name: "배터리 잔량",
        type: "column",
        yAxis: 0,
        data: batteryData.map((data) => data.batteryRemaining),
        tooltip: {
          valueSuffix: " %",
        },
      },
      {
        name: "배터리 온도",
        type: "spline",
        yAxis: 1,
        data: batteryData.map((data) => data.temperature),
        tooltip: {
          valueSuffix: " °C",
        },
      },
      {
        name: "배터리 전압",
        type: "spline",
        yAxis: 2,
        data: batteryData.map((data) => data.voltages),
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
