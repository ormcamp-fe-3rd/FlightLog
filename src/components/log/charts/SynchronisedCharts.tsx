"use client";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";
import { getSatellites, getPosition, getBattery } from "@/hooks/useChartsData";
import useData from "@/store/useData";
import { group } from "console";

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
  unit: number[];
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
          unit: position.map((item) => item[0]),
          data: position.map((item) => item[1]),
        };

        const formattedLon: Dataset = {
          name: "경도",
          type: "line",
          unit: position.map((item) => item[0]),
          data: position.map((item) => item[2]),
        };

        const formattedAlt: Dataset = {
          name: "고도",
          type: "line",
          unit: position.map((item) => item[0]),
          data: position.map((item) => item[3]),
        };

        const formattedSatellites: Dataset = {
          name: "드론 갯수",
          type: "line",
          unit: satelites.map((item) => item[0]),
          data: satelites.map((item) => item[1]),
        };

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

    /* 
    mongodb에서 필터링 된 데이터를 저장하는 부분
    175번줄에 있는 dataset1, dataset2, dataset3,를 수정하여 사용
    단 dataset.unit 부분은 드론의 분류기준으로 실제 data 에 삽입을 하면안됨
    dataset.unit 이 동일한 데이터들을 분류 하고 unit 값을 뺀 데이터를 여러 생성해 그것을 177줄 series 부분에 삽입을 해야함
    ex) 
    const data = dataset.data.map((val: number, i: number) => [
      xData[i],
      val,
    ]); => dataset.unit[0] 기준 분류됨
    const data2 = dataset.data.map((val: number, i: number) => [
      xData[i],
      val,
    ]); -> dataset.unit[1] 기준 분류됨

    */
    const data = dataset.data.map((val: number, i: number) => [
      xData[i],
      val,
      dataset.unit[i],
    ]);

    // dataset.unit 값을 중복 제거하여 고유값을 가져옵니다.
    const uniqueUnits = Array.from(new Set(dataset.unit));

    // 각 uniqueUnit 값에 대해 데이터를 분류하여 저장할 변수들 초기화
    let data1: number[][] = [];
    let data2: number[][] = [];
    let data3: number[][] = [];

    // dataset.data를 통해 각 unit별로 데이터를 분류
    dataset.data.forEach((val: number, i: number) => {
      const unit = dataset.unit[i]; // 현재 unit 값
      const point = [xData[i], val]; // xData와 데이터를 묶은 포인트

      // unit 값에 따라 데이터를 해당 data1, data2, data3로 분류
      switch (unit) {
        case uniqueUnits[0]:
          data1.push(point);
          break;
        case uniqueUnits[1]:
          data2.push(point);
          break;
        case uniqueUnits[2]:
          data3.push(point);
          break;
        default:
          break;
      }
    });

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
          // text: dataset.unit,
          tesxt: " ",
        },
        min: minYValue,
        max: maxYValue * 2,
      },
      plotOptions: {
        series: {
          animation: {
            duration: 2500,
          },
        },
      },

      // 데이터가 차트로 변환 되는 부분 data: data는 데이터값, 나머지 부분은 수정 불필요
      series: [
        // 첫 번째 라인: dataset1
        {
          name: `${dataset.name} 1`,
          type: dataset.type,
          data: data1, // 첫 번째 유닛 데이터만 사용
          color: colour,
        },
        // 두 번째 라인: dataset2
        {
          name: `${dataset.name} 2`,
          type: dataset.type,
          data: data2, // 두 번째 유닛 데이터만 사용
          color: colour,
        },
        // 세 번째 라인 : dataset3
        {
          name: `${dataset.name} 3`,
          type: dataset.type,
          data: data3, // 세 번째 유닛 데이터만 사용
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
