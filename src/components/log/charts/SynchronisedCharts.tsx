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
}

const SynchronisedCharts: React.FC<SynchronisedChartsProps> = ({
  numOfDatasets = 3,
  chartWidth = 400,
  chartHeight = 200,
}) => {
  const { telemetryData, selectedOperationId } = useData();

  const [chartData, setChartData] = useState<Dataset[]>([]);
  const [xData, setXData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const satelites = getSatellites(telemetryData, selectedOperationId);
        const position = getPosition(telemetryData, selectedOperationId);

        const xAxisData = position.map((item) => item[4]);
        setXData(xAxisData);

        const formattedLat: Dataset = {
          name: "위도",
          type: "line",
          unit: "",
          data: position.map((item) => item[1]),
        };

        const formattedLon: Dataset = {
          name: "경도",
          type: "line",
          unit: "",
          data: position.map((item) => item[2]),
        };

        const formattedAlt: Dataset = {
          name: "고도",
          type: "line",
          unit: "",
          data: position.map((item) => item[3]),
        };

        const formattedSatellites: Dataset = {
          name: "드론 갯수",
          type: "line",
          unit: "",
          data: satelites.map((item) => item[1]), // [number, number][] 중 첫 번째 값만 추출
        };

        // const formattedSatellites = satellites.map((data) => ({
        //   name: `Satellites`,
        //   type: "line",
        //   unit: "count",
        //   data,
        // }));

        // const formattedBattery = [
        //   {
        //     name: "Battery",
        //     type: "area",
        //     unit: "%",
        //     data: battery.map((item) => item[2]), // battery_remaining
        //   },
        // ];

        setChartData([
          formattedLat,
          formattedLon,
          formattedAlt,
          formattedSatellites,
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [telemetryData, selectedOperationId]);

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

    const maxYValue = Math.max(...dataset.data); // y축 최대값 계산
    const minYValue = Math.min(...dataset.data); // y축 최대값 계산

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
          format: "{value}",
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
        min: minYValue,
        max: maxYValue,
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
      className="grid grid-cols-1"
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        chartData
          .slice(0, numOfDatasets)
          .map((dataset, index) => (
            <div key={dataset.name}>{renderChart(dataset, index)}</div>
          ))
      )}
    </div>
  );
};

export default SynchronisedCharts;
