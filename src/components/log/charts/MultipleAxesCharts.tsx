"use client";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsStock from "highcharts/modules/stock";
import useData from "@/store/useData";

if (typeof Highcharts === "object") {
  HighchartsStock(Highcharts);
}

const BatteryStatusChart = () => {
  const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null);
  const [chartWidth, setChartWidth] = React.useState(1000);

  React.useEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth;
      setChartWidth(containerWidth);

      if (chartComponentRef.current) {
        chartComponentRef.current.chart.reflow();
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { telemetryData, selectedOperationId, validOperationLabels } =
    useData();
  const batteryData = telemetryData[147] || [];

  const filteredData = batteryData.filter((data) =>
    selectedOperationId.includes(data.operation),
  );

  const hasData = filteredData.length > 0;

  const createChartOptions = () => {
    const colorSchemes = {
      battery: ["#00ff00", "#33cc33", "#269926", "#1a661a"], // green
      temperature: ["#ff6666", "#ff3333", "#ff0000", "#cc0000"], // red
      voltage: ["#3366ff", "#0044cc", "#003399", "#002266"], // blue
    };

    const series = selectedOperationId.map((operationId, index) => {
      const operationData = filteredData
        .filter((data) => data.operation === operationId)
        .sort(
          (currentData, nextData) =>
            new Date(currentData.timestamp).getTime() -
            new Date(nextData.timestamp).getTime(),
        );

      if (operationData.length === 0) return [];

      const times = operationData.map((telemetryPoint) =>
        new Date(telemetryPoint.timestamp).getTime(),
      );

      return [
        {
          name: `배터리 잔량 (${validOperationLabels[operationId]})`,
          type: "area",
          yAxis: 2,
          color: colorSchemes.battery[index % colorSchemes.battery.length],
          data: operationData.map((data, batterRemain) => [
            times[batterRemain],
            data.payload.batteryRemaining,
          ]),
          tooltip: { valueSuffix: " %", xDateFormat: "%Y-%m-%d %H:%M:%S" },
        },
        {
          name: `온도 (${validOperationLabels[operationId]})`,
          type: "spline",
          dashStyle: "shortdot",
          yAxis: 0,
          color:
            colorSchemes.temperature[index % colorSchemes.temperature.length],
          data: operationData.map((data, temp) => [
            times[temp],
            data.payload.temperature,
          ]),
          tooltip: { valueSuffix: "°C" },
        },
        {
          name: `전압 (${validOperationLabels[operationId]})`,
          type: "line",
          yAxis: 1,
          color: colorSchemes.voltage[index % colorSchemes.voltage.length],
          data: operationData.map((data, volt) => [
            times[volt],
            data.payload.voltages[0],
          ]),
          tooltip: { valueSuffix: "V" },
        },
      ];
    });

    const filteredSeries = series
      .flat()
      .filter((s) => s.data && s.data.length > 0);

    // 그래프 Y축에 사용할 각 데이터 최대, 최소 값
    const tempData = filteredData.map((data) => data.payload.temperature);
    const voltData = filteredData.map((data) => data.payload.voltages[0]);
    const batteryData = filteredData.map(
      (data) => data.payload.batteryRemaining,
    );

    const tempMax = Math.ceil(Math.max(...tempData));
    const tempMin = Math.floor(Math.min(...tempData));
    const voltMax = Math.ceil(Math.max(...voltData));
    const voltMin = Math.floor(Math.min(...voltData));
    const batteryMax = Math.ceil(Math.max(...batteryData));
    const batteryMin = Math.floor(Math.min(...batteryData));
    const sidebarWidth = 250;

    return {
      chart: {
        height: 600,
        width: chartWidth - sidebarWidth,
        zooming: {
          mouseWheel: {
            enabled: true,
            type: "x",
          },
        },
        panning: {
          enabled: true,
          type: "x",
        },
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
            count: 5,
            text: "5분",
          },
          {
            type: "minute",
            count: 30,
            text: "30분",
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
            type: "week",
            count: 2,
            text: "2주",
          },
          {
            type: "month",
            count: 1,
            text: "1달",
          },
          {
            type: "all",
            text: "전체",
          },
        ],
        inputEnabled: true,
        selected: 3,
        inputDateFormat: "%Y-%m-%d %H:%M:%S",
        inputEditDateFormat: "%Y-%m-%d %H:%M:%S",
      },
      navigator: {
        enabled: true,
        height: 70,
        margin: 10,
      },
      scrollbar: {
        enabled: true,
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
          max: tempMax,
          min: tempMin,
        },
        {
          title: { text: "전압 (V)" },
          labels: { format: "{value}V" },
          opposite: true,
          max: voltMax,
          min: voltMin,
        },
        {
          title: { text: "배터리 잔량 (%)" },
          labels: { format: "{value}%" },
          max: batteryMax,
          min: batteryMin,
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
        crosshairs: true,
      },
      series: filteredSeries,
    };
  };

  return (
    <div>
      {hasData ? (
        <HighchartsReact
          ref={chartComponentRef}
          highcharts={Highcharts}
          options={createChartOptions()}
        />
      ) : (
        <p className="p-10 text-center text-gray-500">데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default BatteryStatusChart;
