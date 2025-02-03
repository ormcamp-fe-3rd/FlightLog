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
    <div className="rounded-lg bg-white p-4">
      {chartData.length == 0 ? (
        <p className="p-10 text-center text-gray-500">
          선택된 데이터가 없습니다.
        </p>
      ) : (
        <div className="flex flex-row flex-wrap">
          {chartData.map((dataset, index) => (
            <div key={dataset.name} className="min-w-[300px] flex-1">
              {renderChart(dataset, index, xData)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default test;
