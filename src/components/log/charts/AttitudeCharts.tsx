"use client";
import React, { useMemo } from "react";
import Highcharts, { chart } from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import useData from "@/store/useData";

import {
  renderChart,
  useSynchronisedChartsData as useAttitudeChartsData,
  useChartXData,
} from "@/hooks/useAttitudeChartsData ";

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

const AttitudeCharts: React.FC<SynchronisedChartsProps> = ({
  numOfDatasets = DefaultSynchronisedChartsProps.numOfDatasets,
}) => {
  const { telemetryData, selectedOperationId } = useData();

  const chartData = useAttitudeChartsData({
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

  const renderChartData = useMemo(() => {
    return chartData.slice(0, numOfDatasets).map((dataset, index) => (
      <div key={dataset.name} className="min-w-[300px] flex-1">
        {renderChart(dataset, index, xData)}
      </div>
    ));
  }, [chartData, numOfDatasets, xData]);

  return (
    <div
      // onMouseMove={handleMouseMove}
      // onTouchMove={handleMouseMove}
      className="rounded-lg bg-white p-4"
    >
      {chartData.length == 0 ? (
        <p className="p-10 text-center text-gray-500">
          {/* 선택된 데이터가 없습니다. */}
        </p>
      ) : (
        <div className="flex flex-row flex-wrap gap-4">{renderChartData}</div>
      )}
    </div>
  );
};

export default AttitudeCharts;
