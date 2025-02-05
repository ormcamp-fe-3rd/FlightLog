import { Dataset } from "@/types/api";
import { getAltitude, groupDataById } from "@/hooks/useChartsData";
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

interface useChartDataTransformProps {
  telemetryData: any;
  selectedOperationId: string[];
}

const useChartXData = (telemetryData: any, selectedOperationId: string[]) => {
  const [xData, setXData] = useState<number[]>([]);

  useEffect(() => {
    const droneAltitude = getAltitude(telemetryData, selectedOperationId); // 드론 속도, 고도값

    const xAxisData = droneAltitude.map((timeStamp) => timeStamp[3]);

    setXData(xAxisData);
  }, [telemetryData, selectedOperationId]);

  return xData;
};

const useStatusChartsChartsData = ({
  telemetryData,
  selectedOperationId,
}: useChartDataTransformProps) => {
  const [chartData, setChartData] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const droneAltitude = getAltitude(telemetryData, selectedOperationId);

        if (!droneAltitude.length) {
          return null;
        }

        const formattedAlt: Dataset = {
          name: "고도",
          type: "area",
          unit: droneAltitude.map((item) => item[0]),
          data: droneAltitude.map((item) => item[2]),
        };

        const formattedSpeed: Dataset = {
          name: "속도",
          type: "area",
          unit: droneAltitude.map((item) => item[0]),
          data: droneAltitude.map((item) => item[1]),
        };

        setChartData([formattedAlt, formattedSpeed]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [telemetryData, selectedOperationId]);
  return chartData;
};
// TODO: 컴포넌트 내 차트 옵션생성 로직 추출 목적
const createChartOptions = (
  dataset: Dataset,
  index: number,
  xData: number[],
) => {
  const data = dataset.data.map((val: number, i: number) => [
    xData[i],
    val,
    dataset.unit[i],
  ]);

  const groupData = groupDataById(data);
  const groupDataKeys = Object.keys(groupData);

  const colours = Highcharts.getOptions().colors || [];
  const maxYValue = Math.max(...dataset.data); // y축 최대값 계산
  const minYValue = Math.min(...dataset.data); // y축 최대값 계산

  const options = {
    chart: {
      zooming: {
        type: "x",
      },
      width: 700,
      height: 400,
    },
    title: {
      text: dataset.name,
    },
    xAxis: {
      crosshair: true,
      labels: {
        formatter: function () {
          return ((this as any).value / 10).toFixed(0) + " 초";
        },
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
        text: " ",
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
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 616,
          },
          chartOptions: {
            legend: {
              enabled: true,
            },
          },
        },
      ],
    },
    series: groupDataKeys.map((key, idx) => ({
      name: `${dataset.name} ${idx + 1}`,
      type: dataset.type,
      step: true,
      data: groupData[key], // 동적으로 데이터 할당
      color: colours[idx % colours.length],
      turboThreshold: 5000,
    })),
    tooltip: {
      valueSuffix: ` ${dataset.name}`,
    },
  };

  return options;
};

const renderChart = (dataset: Dataset, index: number, xData: number[]) => {
  const options = createChartOptions(dataset, index, xData);
  if (!options) return null;
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      key={dataset.name}
    />
  );
};

export {
  useStatusChartsChartsData as useSynchronisedChartsData,
  renderChart,
  useChartXData,
};
