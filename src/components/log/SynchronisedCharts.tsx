"use client";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";

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

const SynchronisedCharts = () => {
  interface ChartData {
    xData: number[];
    datasets: Dataset[];
  }

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/activity.json");

        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        const json = await response.json();
        setChartData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    if (!chartData || !chartData.xData) return null;

    const data = dataset.data.map((val: number, i: number) => [
      chartData.xData[i],
      val,
    ]);

    const colours = Highcharts.getOptions().colors;
    const colour =
      colours && colours.length > index ? colours[index] : undefined;

    const options = {
      chart: {
        zooming: {
          type: "x",
        },
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
    let point = null;
    let event: Highcharts.PointerEventObject | null = null;

    e.persist();

    Highcharts.charts.forEach((chart) => {
      if (!chart) return;

      const normalizedEvent = chart.pointer.normalize(e as any);
      point = chart.series[0].searchPoint(normalizedEvent, true);
      if (point) {
        point.highlight(normalizedEvent);
      }
    });
  };

  return (
    <div onMouseMove={handleMouseMove} onTouchMove={handleMouseMove}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        chartData && chartData.datasets.map(renderChart)
      )}
    </div>
  );
};

export default SynchronisedCharts;
