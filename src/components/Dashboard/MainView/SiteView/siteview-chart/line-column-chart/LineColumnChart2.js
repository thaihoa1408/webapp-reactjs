import React, { Component, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "./LineColumnChart.css";
import axios from "axios";
import config from "../../../../../../config.json";
function LineColumnChart2(props) {
  const [data, setData] = useState({
    actualProduction: [],
    budgetProduction: [],
    completionRate: [],
    label: [],
  });
  const series = [
    {
      name: "Actual Production",
      type: "column",
      data: data.actualProduction,
    },
    {
      name: "Budget Production",
      type: "column",
      data: data.budgetProduction,
    },
    {
      name: "Budget Production Rate",
      type: "line",
      data: data.completionRate,
    },
  ];
  const options = {
    chart: {
      //height: 350,
      type: "line",
      animations: {
        enabled: false,
      },
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {},
    stroke: {
      width: [3, 3, 3],
      colors: ["transparent", "transparent", "#ffd25c"],
    },
    title: {
      //text: 'Traffic Sources',
    },
    markers: {
      size: 1,
      strokeColors: ["#00f9fc", "#d0ff00", "orange"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
    },
    legend: {
      show: true,
      labels: {
        colors: "#f1f1f1",
      },
    },
    tooltip: {
      enabled: true,
    },
    dataLabels: {
      enabled: false,
    },
    labels: data.label,
    grid: {
      show: true,
      borderColor: "#90A4AE",
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
        rotate: 0,
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
      tickAmount: 6,
    },
    yaxis: [
      {
        seriesName: "Actual Production",
        opposite: false,
        title: {
          text: "kWh",
          offsetX: 20,
          offsetY: -100,
          rotate: 0,
          style: {
            color: "#90A4AE",
            fontWeight: 500,
            fontSize: 13,
          },
        },
        labels: {
          style: {
            colors: "#90A4AE",
          },
        },
      },
      {
        seriesName: "Actual Production",
        show: false,
        opposite: false,
        title: {
          text: "kWh",
          offsetX: 20,
          offsetY: -150,
          rotate: 0,
          style: {
            color: "#90A4AE",
            fontWeight: 500,
            fontSize: 13,
          },
        },
        labels: {
          style: {
            colors: "#90A4AE",
          },
        },
      },
      {
        seriesName: "Budget Production Rate",
        opposite: true,
        title: {
          text: "%",
          offsetX: -20,
          offsetY: -100,
          rotate: 0,
          style: {
            color: "#90A4AE",
            fontWeight: 500,
            fontSize: 13,
          },
        },
        labels: {
          style: {
            colors: "#90A4AE",
          },
        },
      },
    ],
    tooltip: {
      y: [
        {
          formatter: function (val) {
            return val + " kWh";
          },
        },
        {
          formatter: function (val) {
            return val + " kWh";
          },
        },
        {
          formatter: function (val) {
            return val + " %";
          },
        },
      ],
    },
  };
  const [inter, setInter] = useState(true);
  let interval;
  let year = props.date.split("-")[0];
  useEffect(() => {
    const getData = () => {
      axios
        .get(`/siteview/linecolumnchart2`, {
          params: {
            siteid: props.siteid,
            date: year,
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
  }, [props.siteid, inter, props.date]);
  return (
    <div className="line-column-chart">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={250}
      />
    </div>
  );
}

export default LineColumnChart2;
