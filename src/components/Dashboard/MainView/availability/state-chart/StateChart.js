import React, { useState } from "react";
import "./StateChart.css";
import ReactApexChart from "react-apexcharts";
export default function StateChart() {
  const [data, setData] = useState({
    data1: [100, 100, 100, 100],
    data2: [100, 100, 100, 100],
    data3: [100, 100, 100, 100],
    data4: ["2021/06/13", "2021/06/14", "2021/06/15", "2021/06/16"],
  });
  const series = [
    {
      name: "Operational",
      type: "line",
      data: data.data2,
    },
    {
      name: "Technical",
      type: "line",
      data: data.data2,
    },
    {
      name: "Customized",
      type: "line",
      data: data.data2,
    },
  ];
  const options = {
    chart: {
      type: "line",
      animations: {
        enabled: false,
      },
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    legend: {
      show: true,
      fontSize: "14px",
      labels: {
        colors: "#f1f1f1",
      },
      position: "top",
      horizontalAlign: "center",
    },
    tooltip: {
      enabled: true,
    },
    dataLabels: {
      enabled: false,
    },
    labels: data.data4,
    grid: {
      show: true,
      borderColor: "#90A4AE",
      strokeDashArray: 4,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      column: {
        colors: undefined,
        opacity: 0.5,
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: "#90A4AE",
        },
      },
      axisBorder: {
        show: true,
        color: "#78909C",
        height: 1,
        width: "100%",
        position: "bottom",
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: "solid",
        color: "#78909C",
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: [
      {
        title: {
          style: {
            color: "#90A4AE",
            fontWeight: 500,
            fontSize: 13,
          },
        },
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: {
          style: {
            colors: "#90A4AE",
            fontSize: "13px",
          },

          formatter: (value) => {
            return value + "%";
          },
        },
      },
    ],
  };
  return (
    <div className="state-chart">
      <header>{"Operational & Technical & Customized"}</header>
      <section>
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height="95%"
        />
      </section>
    </div>
  );
}
