import React, { Component, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "./LineColumnChart.css";
import axios from "axios";
import config from "../../../../../config.json";
function LineColumnChart2(props) {
  const [data, setData] = useState({
    production: [],
    irradiation: [],
    pr: [],
    label: [],
  });
  const series = [
    {
      name: "Production",
      type: "column",
      data: data.production,
    },
    {
      name: "Irradiation",
      type: "line",
      data: data.irradiation,
    },
    {
      name: "PR",
      type: "line",
      data: data.pr,
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        endingShape: "rounded",
      },
    },
    colors: ["rgb(0, 204, 255)", "rgb(255, 145, 46)", "rgb(50, 234, 170)"],
    stroke: {
      width: 2,
      curve: "smooth",
    },
    title: {
      //text: 'Traffic Sources',
    },
    markers: {
      size: 1,
      strokeColors: [
        "rgb(0, 204, 255)",
        "rgb(255, 145, 46)",
        "rgb(50, 234, 170)",
      ],
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
      tickAmount: 7,
    },
    yaxis: [
      {
        showAlways: true,
        title: {
          text: "kWh",
          offsetX: 20,
          offsetY: -70,
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
          formatter: (value) => {
            return value;
          },
        },
      },
      {
        opposite: true,
        show: true,
        showAlways: true,
        title: {
          text: "Wh/㎡",
          offsetX: -20,
          offsetY: -70,
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
          formatter: (value) => {
            return value;
          },
        },
      },
      {
        opposite: true,
        showAlways: true,
        title: {
          text: "%",
          offsetX: -20,
          offsetY: -70,
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
          formatter: (value) => {
            return value;
          },
        },
      },
    ],
    tooltip: {
      y: [
        {
          formatter: function (val) {
            return val + "kWh";
          },
        },
        {
          formatter: function (val) {
            return val + "Wh/㎡";
          },
        },
        {
          formatter: function (val) {
            return val + "%";
          },
        },
      ],
    },
  };
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  const [inter, setInter] = useState(true);
  let interval;
  let datevar = formatDate(new Date());
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  useEffect(() => {
    const getData = () => {
      axios
        .get(`/sitekpi/linecolumnchart2`, {
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
      }, 5000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [props.siteid, inter, props.date, props.timeselect]);
  return (
    <div className="line-column-chart">
      <div className="line-column-chart-container">
        <div className="line-column-chart-header">
          Production & Irradiation & PR
        </div>
        <div className="line-column-chart-body">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={190}
          />
        </div>
      </div>
    </div>
  );
}

export default LineColumnChart2;
