"use client";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsStock from "highcharts/modules/stock";
import useData from "@/store/useData";

// Highcharts Stock 모듈 초기화
if (typeof Highcharts === "object") {
  HighchartsStock(Highcharts);
}

const BatteryStatusChart = () => {
  const { telemetryData, selectedOperationId, validOperationLabels } =
    useData();
  const batteryData = telemetryData[147] || [];

  const filteredData = batteryData.filter((data) =>
    selectedOperationId.includes(data.operation),
  );

  const createChartOptions = () => {
    const colorSchemes = {
      battery: ["#00ff00", "#33cc33", "#269926", "#1a661a"], // green
      temperature: ["#ff6666", "#ff3333", "#ff0000", "#cc0000"], // red
      voltage: ["#3366ff", "#0044cc", "#003399", "#002266"], // blue
    };

    const series = selectedOperationId.map((opId, index) => {
      const operationData = filteredData
        .filter((data) => data.operation === opId)
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );

      if (operationData.length === 0) return [];

      const times = operationData.map((d) => new Date(d.timestamp).getTime());

      return [
        {
          name: `배터리 잔량 (${validOperationLabels[opId]})`,
          type: "area",
          yAxis: 2,
          color: colorSchemes.battery[index % colorSchemes.battery.length],
          data: operationData.map((d, i) => [
            times[i],
            d.payload.batteryRemaining,
          ]),
          tooltip: { valueSuffix: "%" },
        },
        {
          name: `온도 (${validOperationLabels[opId]})`,
          type: "spline",
          dashStyle: "shortdot",
          yAxis: 0,
          color:
            colorSchemes.temperature[index % colorSchemes.temperature.length],
          data: operationData.map((d, i) => [times[i], d.payload.temperature]),
          tooltip: { valueSuffix: "°C" },
        },
        {
          name: `전압 (${validOperationLabels[opId]})`,
          type: "line",
          yAxis: 1,
          color: colorSchemes.voltage[index % colorSchemes.voltage.length],
          data: operationData.map((d, i) => [times[i], d.payload.voltages[0]]),
          tooltip: { valueSuffix: "V" },
        },
      ];
    });

    const filteredSeries = series
      .flat()
      .filter((s) => s.data && s.data.length > 0);

    return {
      chart: {
        height: 500,
        width: 1200,
      },
      rangeSelector: {
        enabled: true,
        buttons: [
          {
            type: "minute",
            count: 1,
            text: "1분",
          },
          {
            type: "minute",
            count: 3,
            text: "3분",
          },
          {
            type: "hour",
            count: 1,
            text: "1시간",
          },
          {
            type: "day",
            count: 1,
            text: "1일",
          },
          {
            type: "week",
            count: 1,
            text: "1주",
          },
          {
            type: "month",
            count: 1,
            text: "1개월",
          },
          {
            type: "all",
            text: "전체",
          },
        ],
        inputEnabled: true,
        selected: 3,
      },
      title: { text: "배터리 상태" },
      xAxis: {
        type: "datetime",
        crosshair: true,
      },
      yAxis: [
        {
          title: { text: "온도 (°C)" },
          labels: { format: "{value}°C" },
        },
        {
          title: { text: "전압 (V)" },
          labels: { format: "{value}V" },
          opposite: true,
        },
        {
          title: { text: "배터리 잔량 (%)" },
          labels: { format: "{value}%" },
          max: 100,
          min: 0,
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
        crosshairs: true,
      },
      legend: {
        layout: "horizontal",
        align: "center",
        verticalAlign: "bottom",
      },
      series: filteredSeries,
      responsive: {
        rules: [
          {
            condition: { maxWidth: 500 },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    };
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={createChartOptions()} />
    </div>
  );
};

export default BatteryStatusChart;
