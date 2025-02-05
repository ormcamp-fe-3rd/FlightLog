import { Dataset } from "@/types/api";
import { getStatus, groupDataById } from "@/hooks/useChartsData";
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { DefaultSynchronisedChartsProps } from "@/components/log/charts/AttitudeCharts";

interface useChartDataTransformProps {
  telemetryData: any;
  selectedOperationId: string[];
}

const useChartXData = (telemetryData: any, selectedOperationId: string[]) => {
  const [xData, setXData] = useState<number[]>([]);

  useEffect(() => {
    const droneStatus = getStatus(telemetryData, selectedOperationId); // 드론 자세값
    const xAxisData = droneStatus.map((timeStamp) =>
      new Date(timeStamp[4]).getTime(),
    );

    setXData(xAxisData);
  }, [telemetryData, selectedOperationId]);

  return xData;
};

const useAttitudeChartsData = ({
  telemetryData,
  selectedOperationId,
}: useChartDataTransformProps) => {
  const [chartData, setChartData] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const droneStatus = getStatus(telemetryData, selectedOperationId);

        if (!droneStatus.length) {
          return null;
        }

        const formattedRoll: Dataset = {
          name: "roll",
          type: "line",
          unit: droneStatus.map((item) => item[0]),
          data: droneStatus.map((item) => item[1]),
        };

        const formattedPitch: Dataset = {
          name: "pitch",
          type: "line",
          unit: droneStatus.map((item) => item[0]),
          data: droneStatus.map((item) => item[2]),
        };

        const formattedYaw: Dataset = {
          name: "yaw",
          type: "line",
          unit: droneStatus.map((item) => item[0]),
          data: droneStatus.map((item) => item[3]),
        };

        setChartData([formattedRoll, formattedPitch, formattedYaw]);
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
  if (!xData.length) return null;

  const data = dataset.data.map((val: number, i: number) => [
    xData[i],
    val,
    dataset.unit[i],
  ]);

  const sortedData = data.sort((a, b) => a[0] - b[0]);

  const groupData = groupDataById(sortedData);
  const groupDataKeys = Object.keys(groupData);

  const colours = Highcharts.getOptions().colors || [];
  const maxYValue = Math.max(...dataset.data); // y축 최대값 계산
  const minYValue = Math.min(...dataset.data); // y축 최대값 계산

  const minXValue = Math.min(...xData);
  const maxXValue = Math.max(...xData);

  const options = {
    chart: {
      zooming: {
        type: "x",
      },
      width: DefaultSynchronisedChartsProps.chartWidth,
      height: DefaultSynchronisedChartsProps.chartHeight,
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
            maxWidth: 1500, // 화면 가로 크기가 768px 이하일 때
          },
          chartOptions: {
            chart: {
              height: 470, // 차트 높이 조정
            },
            xAxis: {
              labels: {},
            },
            yAxis: {
              title: {
                text: "속도",
              },
            },
            legend: {
              enabled: false, // 작은 화면에서는 범례 숨김
            },
          },
        },
        {
          condition: {
            maxWidth: 480, // 화면 가로 크기가 480px 이하일 때
          },
          chartOptions: {
            chart: {
              height: 250, // 차트 높이 더 작게 설정
            },
            xAxis: {
              labels: {},
            },
            yAxis: {
              title: {
                text: " ",
              },
            },
          },
        },
      ],
    },

    // 데이터가 차트로 변환 되는 부분 data: data는 데이터값, 나머지 부분은 수정 불필요
    series: groupDataKeys.map((key, idx) => ({
      name: `${dataset.name} ${idx + 1}`,
      type: dataset.type,
      step: true,
      data: groupData[key],
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
  useAttitudeChartsData as useSynchronisedChartsData,
  renderChart,
  useChartXData,
};
