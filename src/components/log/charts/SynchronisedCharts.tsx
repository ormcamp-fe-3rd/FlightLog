"use client";
import React from "react";
import Highcharts, { chart } from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import useData from "@/store/useData";

import {
  renderChart,
  useChartDataTransform,
  useChartXData,
} from "@/hooks/useSynchronisedChartsData ";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
}

declare module "highcharts" {
  interface Point {
    highlight: (event: PointerEventObject) => void;
  }
}

interface SynchronisedChartsProps {
  numOfDatasets?: number;
  chartWidth?: number;
  chartHeight?: number;
}

export const DefaultSynchronisedChartsProps = {
  numOfDatasets: 3,
  chartWidth: 400,
  chartHeight: 200,
};

const SynchronisedCharts: React.FC<SynchronisedChartsProps> = ({
  numOfDatasets = DefaultSynchronisedChartsProps.numOfDatasets,
  chartWidth = DefaultSynchronisedChartsProps.chartWidth,
  chartHeight = DefaultSynchronisedChartsProps.chartHeight,
}) => {
  const { telemetryData, selectedOperationId } = useData();

  const chartData = useChartDataTransform({
    telemetryData,
    selectedOperationId,
  });
  const xData = useChartXData(telemetryData, selectedOperationId);

  // const handleMouseMove = (
  //   e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  // ) => {
  //   Highcharts.charts.forEach((chart) => {
  //     if (!chart) return;

  //     const normalizedEvent = chart.pointer.normalize(e as any);
  //     const point = chart.series[0].searchPoint(normalizedEvent, true);
  //     if (point) {
  //       point.highlight(normalizedEvent);
  //     }
  //   });
  // };

  return (
    <div
      // onMouseMove={handleMouseMove}
      // onTouchMove={handleMouseMove}
      className="grid grid-cols-1"
    >
      {chartData.length == 0 ? (
        <p>Loading...</p>
      ) : (
        chartData
          .slice(0, numOfDatasets)
          .map((dataset, index) => (
            <div key={dataset.name}>{renderChart(dataset, index, xData)}</div>
          ))
      )}
    </div>
  );
};

export default SynchronisedCharts;
