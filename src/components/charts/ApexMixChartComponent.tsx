import React from "react";
import ReactApexChart from "react-apexcharts";

interface ApexMixChartComponentProps {
  options?: any;
  series?: any;
  height?: number;
}

const defaultSeries = [
  {
    name: "Reservation",
    type: "column",
    data: [440, 505, 414, 671, 227, 413],
  },
  {
    name: "Earnings",
    type: "line",
    data: [33, 42, 35, 27, 43, 22],
  },
];

const defaultOptions = {
  chart: {
    height: 350,
    type: "line",
    toolbar: { show: false },
  },
  colors: ["#ef5a60", "#082942"],
  stroke: {
    width: [0, 4],
    curve: "smooth",
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1],
  },
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  xaxis: {
    type: "category",
  },
};

const ApexMixChartComponent: React.FC<ApexMixChartComponentProps> = ({
  options = defaultOptions,
  series = defaultSeries,
  height = 350,
}) => {
  return <ReactApexChart options={options} series={series} type="line" height={height} />;
};

export default ApexMixChartComponent;
