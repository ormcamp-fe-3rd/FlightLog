"use client";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function DroneCharts() {
  const options = {
    chart: {
      // zooming: {
      //   type: "xy",
      // },
      height: 400,
      width: 800,
    },
    title: {
      text: "Average Monthly Weather Data for Tokyo",
    },
    subtitle: {
      text: "Source: WorldClimate.com",
    },
    xAxis: [
      {
        categories: [],
        crosshair: true, //마우스 호버시 시각적 가이드 제공 기능
      },
    ],
    yAxis: [
      {
        labels: {
          format: "{value}",
        },
        title: {
          text: "Temperature",
        },
        opposite: true,
      },
      {
        // // Secondary yAxis
        // gridLineWidth: 0,
        // title: {
        //   text: "Rainfall",
        //   style: {
        //     color: Highcharts.getOptions().colors?.[0] ?? "#000000",
        //   },
        // },
        // labels: {
        //   format: "{value} mm",
        //   style: {
        //     color: Highcharts.getOptions().colors?.[0] ?? "#000000",
        //   },
        // },
      },
      {
        // Tertiary yAxis
        // gridLineWidth: 0,
        // title: {
        //   text: "Sea-Level Pressure",
        //   style: {
        //     color: Highcharts.getOptions().colors?.[1] ?? "#000000",
        //   },
        // },
        // labels: {
        //   format: "{value} mb",
        //   style: {
        //     color: Highcharts.getOptions().colors?.[1] ?? "#000000",
        //   },
        // },
        // opposite: true,
      },
    ],

    // 툴팁 제거시, 포커스된 데이터를 집중적으로 보여줌
    // tooltip: {
    //   shared: true,
    // },
    // legend: {
    //   layout: "vertical",
    //   align: "left",
    //   x: 80,
    //   verticalAlign: "top",
    //   y: 55,
    //   floating: true,
    //   backgroundColor:
    //     Highcharts.defaultOptions.legend?.backgroundColor ??
    //     "rgba(255,255,255,0.25)", // theme
    // },

    // 하드코딩 데이터
    series: [
      {
        name: "Rainfall",
        type: "column",
        yAxis: 1,
        data: [
          49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
          95.6, 54.4,
        ],
        tooltip: {
          valueSuffix: " mm",
        },
      },
      {
        name: "Sea-Level Pressure",
        type: "spline",
        yAxis: 2,
        data: [
          1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1,
          1016.9, 1018.2, 1016.7,
        ],
        marker: {
          enabled: false,
        },
        dashStyle: "shortdot",
        tooltip: {
          valueSuffix: " mb",
        },
      },
      {
        name: "Temperature",
        type: "spline",
        data: [
          7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6,
        ],
        tooltip: {
          valueSuffix: " °C",
        },
      },
    ],
    // responsive: {},
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
