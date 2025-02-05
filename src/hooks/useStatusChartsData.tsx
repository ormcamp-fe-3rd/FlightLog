import { Dataset } from "@/types/api";
import { getAltitude, groupDataById } from "@/hooks/useChartsData";
import { useCallback, useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { getColorFromId } from "@/utils/getColorFromId";
import { title } from "process";

interface useChartDataTransformProps {
  telemetryData: any;
  selectedOperationId: string[];
}

const useChartXData = (telemetryData: any, selectedOperationId: string[]) => {
  const [xData, setXData] = useState<number[]>([]);

  useEffect(() => {
    const droneAltitude = getAltitude(telemetryData, selectedOperationId); // 드론 속도, 고도값

    const xAxisData = droneAltitude.map((timeStamp) =>
      new Date(timeStamp[3]).getTime(),
    );
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

  const fetchData = useCallback(async () => {
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

      Highcharts.charts.forEach((chart) => {
        if (chart) chart.zoomOut();
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [telemetryData, selectedOperationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return chartData;
};
// TODO: 컴포넌트 내 차트 옵션생성 로직 추출 목적
const createChartOptions = (
  dataset: Dataset,
  index: number,
  xData: number[],
) => {
  if (!xData.length) return null;

  const data = dataset.data.map((val, i) => [xData[i], val, dataset.unit[i]]);
  const sortedData = data.sort((a, b) => a[0] - b[0]);
  const groupData = groupDataById(sortedData);
  const groupDataKeys = Object.keys(groupData);
  console.log(groupData);

  const maxYValue = Math.max(...dataset.data); // y축 최대값 계산
  const minYValue = Math.min(...dataset.data); // y축 최대값 계산

  const minXValue = Math.min(...xData);
  const maxXValue = Math.max(...xData);

  return {
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
      type: "datetime",
      crosshair: true,
      min: minXValue,
      max: maxXValue,
      labels: {
        formatter: function (): any {
          const value = (this as any).value;
          const dateObj = new Date(value);
          const formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")} ${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}:${String(dateObj.getSeconds()).padStart(2, "0")}`;
          return formattedDate;
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
        text: "",
      },
      min: 0,
      max: maxYValue,
      labels: {
        formatter: function (): any {
          return (this as any).value + (dataset.name === "고도" ? "m" : " m/s");
        },
      },
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
      name: new Date(groupData[key][0][0]).toLocaleString(),
      type: dataset.type,
      step: true,
      data: groupData[key], // 동적으로 데이터 할당
      color: getColorFromId(groupDataKeys[idx]),
      turboThreshold: 5000,
    })),
    tooltip: {
      valueSuffix: ` ${dataset.name}`,
    },
  };
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
