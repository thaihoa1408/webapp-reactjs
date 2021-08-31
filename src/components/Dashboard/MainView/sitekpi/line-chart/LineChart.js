import React, { useEffect, useState } from "react";
import "./LineChart.css";
import { Bar, Line, Pie } from "react-chartjs-2";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import config from "../../../../../config.json";
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
      tickAmount: 15,
    },
    yaxis: [
      {
        showAlways: true,
        title: {
          text: "kW",
          offsetX: 20,
          offsetY: -75,
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
          offsetY: -75,
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
            return val + "kW";
          },
        },
        {
          formatter: function (val) {
            return val + "W/㎡";
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
    const getData = async () => {
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
      }, 5000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [props.siteid, inter, props.date, props.timeselect]);
  return (
    <div className="line-chart">
      <div className="line-chart-container">
        <div className="line-chart-header">Active Power & Inradiance</div>
        <div className="line-chart-body">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={200}
          />
        </div>
      </div>
    </div>
  );
}

export default LineChart;
