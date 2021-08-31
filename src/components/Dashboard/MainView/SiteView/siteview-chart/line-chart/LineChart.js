import React, { useEffect, useState } from "react";
import "./LineChart.css";
import { Bar, Line, Pie } from "react-chartjs-2";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import config from "../../../../../../config.json";
function LineChart(props) {
  const [data, setData] = useState({
    activePower: [],
    GHI: [],
    label: [],
  });
  const series = [
    {
      name: "Active Power",
      type: "line",
      data: data.activePower,
    },
    {
      name: "Irradiance",
      type: "line",
      data: data.GHI,
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
    colors: ["#00f9fc", "#d0ff00"],
    stroke: {
      width: 2,
      curve: "smooth",
    },
    title: {
      //text: 'Traffic Sources',
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
      tickAmount: 10,
    },
    yaxis: [
      {
        showAlways: true,
        title: {
          text: "kW",
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
        opposite: true,
        showAlways: true,
        title: {
          text: "W/㎡",
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
  };
  const [inter, setInter] = useState(true);
  let interval;
  let year = props.date.split("-")[0];
  let month = props.date.split("-")[1];
  let day = props.date.split("-")[2];
  useEffect(() => {
    const getData = () => {
      axios
        .get(`/siteview/linechart`, {
          params: {
            siteid: props.siteid,
            date: year + "," + month + "," + day,
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
  }, [props.siteid, inter, props.date, props.timeselect]);
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

export default LineChart;
