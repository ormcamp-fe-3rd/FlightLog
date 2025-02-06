import { Dataset } from "@/types/api";
import { getStatus, groupDataById } from "@/hooks/useChartsData";
import { useEffect, useState, useCallback } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { DefaultSynchronisedChartsProps } from "@/components/log/charts/AttitudeCharts";
import { getColorFromId } from "@/utils/getColorFromId";
import { format } from "path";

interface useChartDataTransformProps {
  telemetryData: any;
  selectedOperationId: string[];
}

const useChartXData = (telemetryData: any, selectedOperationId: string[]) => {
  const [xData, setXData] = useState<number[]>([]);

  useEffect(() => {
    const droneStatus = getStatus(telemetryData, selectedOperationId);
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const droneStatus = getStatus(telemetryData, selectedOperationId);

      if (!droneStatus.length) {
        return;
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
  }, [telemetryData, selectedOperationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return chartData;
};

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

  const maxYValue = Math.max(...dataset.data);
  const minYValue = Math.min(...dataset.data);

  const minXValue = Math.min(...xData);
  const maxXValue = Math.max(...xData);

  return {
    chart: {
      zooming: { type: "x" },
      width: null,
      height: 300,
      id: "attitudeChart",
    },
    title: { text: dataset.name },
    xAxis: {
      type: "datetime",
      crosshair: true,
      min: minXValue,
      max: maxXValue,
      labels: {
        formatter: function (): any {
          const value = (this as any).value;
          const dateObj = new Date(value);
          const formattedDate = `${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}:${String(dateObj.getSeconds()).padStart(2, "0")}`;
          return formattedDate;
        },
      },
      events: {
        afterSetExtremes: function (event: Highcharts.ExtremesObject) {
          Highcharts.charts.forEach((chart) => {
            if (chart) chart.xAxis[0].setExtremes(event.min, event.max);
          });
        },
      },
    },
    yAxis: {
      title: { text: "" },
      min: minYValue,
      max: maxYValue,
      labels: {
        formatter: function (): any {
          return (this as any).value + " rad";
        },
      },
    },
    plotOptions: {
      series: {
        animation: { duration: 2500 },
      },
    },
    responsive: {},
    series: groupDataKeys.map((key, idx) => ({
      name: new Date(groupData[key][0][0]).toLocaleString(),
      type: dataset.type,
      step: true,
      data: groupData[key],
      color: getColorFromId(groupDataKeys[idx]),
      turboThreshold: 5000,
    })),
    tooltip: { valueSuffix: ` ${dataset.name}` },
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
  useAttitudeChartsData as useSynchronisedChartsData,
  renderChart,
  useChartXData,
};
