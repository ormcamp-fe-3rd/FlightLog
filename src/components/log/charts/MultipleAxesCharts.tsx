"use client";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import useData from "@/store/useData";

const BatteryStatusChart = () => {
  const { telemetryData, selectedOperationId, validOperationLabels } =
    useData();
  const batteryData = telemetryData[147] || [];

  const filteredData = batteryData.filter((data) =>
    selectedOperationId.includes(data.operation),
  );

  const groupByDate = () => {
    const dateGroups = new Map();

    filteredData.forEach((data) => {
      const date = new Date(data.timestamp).toLocaleDateString();
      if (!dateGroups.has(date)) {
        dateGroups.set(date, []);
      }
      dateGroups.get(date).push(data);
    });

    return dateGroups;
  };

  const createChartOptions = (date: string, dateData: any[]) => {
    const colorSchemes = {
      battery: ["#00ff00", "#33cc33", "#269926", "#1a661a"], // green
      temperature: ["#ff6666", "#ff3333", "#ff0000", "#cc0000"], // red
      voltage: ["#3366ff", "#0044cc", "#003399", "#002266"], // blue
    };

    const currentDateData = dateData.filter(
      (data) => new Date(data.timestamp).toLocaleDateString() === date,
    );

    const series = selectedOperationId.map((opId, index) => {
      const operationData = currentDateData
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
        zooming: { type: "xy" },
        height: 400,
        width: 1200,
      },
      title: { text: `배터리 상태: ${date}` },
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

  const dateGroups = groupByDate();
  return (
    <div>
      {Array.from(dateGroups).map(([date, dateData]) => (
        <div key={date}>
          <HighchartsReact
            highcharts={Highcharts}
            options={createChartOptions(date, dateData)}
          />
        </div>
      ))}
    </div>
  );
};

export default BatteryStatusChart;
