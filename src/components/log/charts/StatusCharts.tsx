"use client";
import React from "react";
import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import useData from "@/store/useData";

import {
  renderChart,
  useSynchronisedChartsData,
  useChartXData,
} from "@/hooks/useStatusChartsData";

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
    <div className="flex w-full items-center justify-center">
      {chartData.length == 0 ? (
        <p>Loading...</p>
      ) : (
        chartData.map((dataset, index) => (
          <div key={dataset.name} className="mb-10 mt-10 w-full">
            {renderChart(dataset, index, xData)}
          </div>
        ))
      )}
    </div>
  );
};

export default test;
