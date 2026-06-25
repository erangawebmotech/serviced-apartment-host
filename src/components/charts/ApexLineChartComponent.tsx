import React from "react";
import ReactApexChart from "react-apexcharts";

interface ApexLineChartComponentProps {
  options?: any;
  series?: any;
  type?: "line" | "bar" | "area";
  height?: number;
}

const defaultSeries = [
  {
    name: "Apartment",
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
  },
  {
    name: "Vila",
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
  },
  {
    name: "Hotel",
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
  },
];

const defaultOptions = {
  chart: {
    type: "bar",
    height: 350,
    toolbar: { show: false },
  },
  colors: ["#ef5a60", "#082942", "#ffb703"],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    curve: "smooth",
  },
  xaxis: {
    categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  },
  yaxis: {
    title: {
      text: "USD",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter(val: number) {
        return `USD ${val}`;
      },
    },
  },
};

const ApexLineChartComponent: React.FC<ApexLineChartComponentProps> = ({
  options = defaultOptions,
  series = defaultSeries,
  type = "bar",
  height = 350,
}) => {
  return <ReactApexChart options={options} series={series} type={type} height={height} />;
};

export default ApexLineChartComponent;
