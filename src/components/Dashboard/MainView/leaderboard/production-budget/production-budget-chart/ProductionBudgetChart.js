import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import config from "../../../../../../config.json";
export default function ProductionBudgetChart(props) {
  const [data, setData] = useState({
    actualProduction: [],
    budgetProduction: [],
    completionRate: [],
    label: [],
  });
  const series = [
    {
      name: "Production",
      type: "column",
      data: data.actualProduction,
    },
    {
      name: "Budget Production",
      type: "line",
      data: data.budgetProduction,
    },
  ];
  const options = {
    chart: {
      //height: 350,
      type: "line",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "25%",
        endingShape: "rounded",
      },
    },
    stroke: {
      width: [0, 2],
    },
    colors: ["#0c8fb9", "#99f14f"],
    title: {
      text: props.sitename,
      offsetY: 20,
      style: {
        fontSize: "15px",
        fontWeight: "bold",
        color: "#fff",
      },
    },
    legend: {
      show: true,
      labels: {
        colors: "#f1f1f1",
      },
      position: "top",
      horizontalAlign: "right",
      fontSize: "15px",
    },
    tooltip: {
      y: {
        formatter: (value) => {
          return value + " kWh";
        },
      },
    },
    markers: {
      size: 1,
      strokeColors: "#99f14f",
      strokeWidth: 2,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
    },
    dataLabels: {
      enabled: false,
    },
    labels: data.data3,
    grid: {
      show: true,
      borderColor: "#768d9b",
      strokeDashArray: 0,
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
          //text: props.sitename,
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
          style: {
            color: "white",
            fontWeight: 500,
            fontSize: 14,
          },
        },
        labels: {
          style: {
            colors: "#90A4AE",
          },
          formatter: (value) => {
            return value;
          },
        },
      },
    ],
  };
  let interval;
  const [inter, setInter] = useState(true);
  useEffect(() => {
    const getData = () => {
      axios
        .get(`/siteview/linecolumnchart2`, {
          params: {
            siteid: props.siteid,
            date: props.date,
          },
        })
        .then((response) => setData(response.data));
    };
    getData();
    if (inter) {
      interval = setInterval(() => {
        getData();
      }, 10000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [props.date, props.siteid]);
  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height="100%"
    />
  );
}
