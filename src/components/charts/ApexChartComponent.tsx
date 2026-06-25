import React from "react";
import ApexChart from "react-apexcharts";

interface ApexChartComponentProps {
  options?: any;
  series?: number[];
  type?: "donut" | "pie" | "polarArea";
  height?: number;
}

const defaultSeries = [14, 23, 21, 17];
const defaultOptions = {
  chart: {
    type: "polarArea",
  },
  labels: ["A", "B", "C", "D"],
  colors: ["#f4d35e", "#082942", "#ffb703", "#ef5a60"],
  stroke: {
    colors: ["#fff"],
  },
  fill: {
    opacity: 0.8,
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

export const ApexChartComponent: React.FC<ApexChartComponentProps> = ({
  options = defaultOptions,
  series = defaultSeries,
  type = "polarArea",
  height = 320,
}) => {
  return <ApexChart options={options} series={series} type={type} height={height} />;
};
