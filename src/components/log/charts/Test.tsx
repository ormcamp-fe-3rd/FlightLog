"use client";
import React from "react";
import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import useData from "@/store/useData";

import {
  renderChart,
  useSynchronisedChartsData,
  useChartXData,
} from "@/hooks/useTest";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
}

declare module "highcharts" {
  interface Point {
    highlight: (event: PointerEventObject) => void;
  }
}

interface SynchronisedChartsProps {
  chartWidth?: number;
  chartHeight?: number;
}

const test: React.FC<SynchronisedChartsProps> = ({}) => {
  const { telemetryData, selectedOperationId } = useData();

  const chartData = useSynchronisedChartsData({
    telemetryData,
    selectedOperationId,
  });
  const xData = useChartXData(telemetryData, selectedOperationId);

  return (
    <div className="grid grid-cols-2 gap-0">
      {chartData.length == 0 ? (
        <p>Loading...</p>
      ) : (
        chartData.map((dataset, index) => (
          <div key={dataset.name}>{renderChart(dataset, index, xData)}</div>
        ))
      )}
    </div>
  );
};

export default test;
