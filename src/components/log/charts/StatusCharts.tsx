"use client";
import React, { useMemo, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import useData from "@/store/useData";

import {
  renderChart,
  useSynchronisedChartsData as useStatusChartsChartsData,
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

const StatusCharts: React.FC<SynchronisedChartsProps> = ({}) => {
  const { telemetryData, selectedOperationId } = useData();

  const chartData = useStatusChartsChartsData({
    telemetryData,
    selectedOperationId,
  });
  const chartContainerRef = useRef<HTMLDivElement>(null); // ✅ 차트 컨테이너 참조

  const xData = useChartXData(telemetryData, selectedOperationId);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (!chartContainerRef.current) return;

    Highcharts.charts.forEach((chart) => {
      if (!chart || !chart.series.length) return;

      if ((chart.options.chart as any)?.id !== "statusChart") return;

      const normalizedEvent = chart.pointer.normalize(e as any);
      const point = chart.series[0].searchPoint(normalizedEvent, true);
      if (point) {
        point.highlight(normalizedEvent);
      }
    });
  };

  const renderChartData = useMemo(() => {
    return chartData.map((dataset, index) => (
      <div key={dataset.name} className="min-w-[300px] flex-1">
        {renderChart(dataset, index, xData)}
      </div>
    ));
  }, [chartData, xData]);

  return (
    <div
      // ref={chartContainerRef}
      // onMouseMove={handleMouseMove}
      // onTouchMove={handleMouseMove}
      className="rounded-lg bg-white p-4"
    >
      {chartData.length === 0 ? (
        <p className="p-10 text-center text-gray-500">
          {/* 선택된 데이터가 없습니다. */}
        </p>
      ) : (
        <div className="grid grid-cols-1">{renderChartData}</div>
      )}
    </div>
  );
};

export default StatusCharts;
