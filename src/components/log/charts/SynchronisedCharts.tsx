"use client";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";
import { getSatellites, getPosition, getBattery } from "@/hooks/useChartsData";
import useData from "@/store/useData";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
}

declare module "highcharts" {
  interface Point {
    highlight: (event: PointerEventObject) => void;
  }
}

interface Dataset {
  name: string;
  type: string;
  unit: string;
  data: number[];
}

interface SynchronisedChartsProps {
  numOfDatasets?: number;
  chartWidth?: number;
  chartHeight?: number;
  operationId?: string;
}

const SynchronisedCharts: React.FC<SynchronisedChartsProps> = ({
  numOfDatasets = 3,
  chartWidth = 400,
  chartHeight = 200,
  operationId,
}) => {
  const { telemetryData, selectedOperationId } = useData();

  const [chartData, setChartData] = useState<Dataset[]>([]);
  const [xData, setXData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!operationId) {
          throw new Error("operationId is undefined");
        }
        const satellites = await getSatellites(telemetryData, operationId);
        const battery = await getBattery(telemetryData, operationId);
        const position = await getPosition(telemetryData, operationId);

        const xAxisData = position.map((pos) => pos[0]); // lat 값을 xData로 사용
        setXData(xAxisData);

        const formattedSatellites = satellites.map((data, i) => ({
          name: `Satellites ${i + 1}`,
          type: "line",
          unit: "count",
          data,
        }));

        const formattedBattery = [
          {
            name: "Battery",
            type: "area",
            unit: "%",
            data: battery.map((item) => item[2]), // battery_remaining
          },
        ];

        setChartData([...formattedSatellites, ...formattedBattery]);
      } catch (error) {
        console.error("Error fetching MongoDB data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [operationId]);

  useEffect(() => {
    const oldReset = Highcharts.Pointer.prototype.reset;
    const oldHighlight = Highcharts.Point.prototype.highlight;

    Highcharts.Pointer.prototype.reset = () => {};
    Highcharts.Point.prototype.highlight = function (event) {
      this.onMouseOver();
      this.series.chart.tooltip.refresh(this);
      this.series.chart.xAxis[0].drawCrosshair(event, this);
    };

    return () => {
      Highcharts.Pointer.prototype.reset = oldReset;
      Highcharts.Point.prototype.highlight = oldHighlight;
    };
  }, []);

  const renderChart = (dataset: Dataset, index: number) => {
    if (!xData.length) return null;

    const data = dataset.data.map((val: number, i: number) => [xData[i], val]);

    const colours = Highcharts.getOptions().colors;
    const colour =
      colours && colours.length > index ? colours[index] : undefined;

    const options = {
      chart: {
        zooming: {
          type: "x",
        },
        width: chartWidth,
        height: chartHeight,
      },
      title: {
        text: dataset.name,
      },
      xAxis: {
        crosshair: true,
        labels: {
          format: "{value} km",
        },
        events: {
          afterSetExtremes: function (event: Highcharts.ExtremesObject) {
            Highcharts.charts.forEach((chart) => {
              if (!chart) return null;
              chart.xAxis[0].setExtremes(event.min, event.max);
            });
          },
        },
      },
      yAxis: {
        title: {
          text: dataset.unit,
        },
      },
      plotOptions: {
        series: {
          animation: {
            duration: 2500,
          },
        },
      },
      series: [
        {
          name: dataset.name,
          type: dataset.type,
          data: data,
          color: colour,
        },
      ],
      tooltip: {
        valueSuffix: ` ${dataset.unit}`,
      },
    };
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        key={dataset.name}
      />
    );
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    Highcharts.charts.forEach((chart) => {
      if (!chart) return;

      const normalizedEvent = chart.pointer.normalize(e as any);
      const point = chart.series[0].searchPoint(normalizedEvent, true);
      if (point) {
        point.highlight(normalizedEvent);
      }
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      className="grid grid-cols-2"
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        chartData
          .slice(0, numOfDatasets) // props를 사용하여 데이터셋 개수 조정
          .map((dataset, index) => (
            <div key={dataset.name}>{renderChart(dataset, index)}</div>
          ))
      )}
    </div>
  );
};

export default SynchronisedCharts;
