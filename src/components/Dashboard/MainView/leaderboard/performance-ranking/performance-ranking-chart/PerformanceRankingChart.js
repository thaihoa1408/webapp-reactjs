import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getUser } from "../../../../../Utils/Common";
import config from "../../../../../../config.json";
import axios from "axios";
export default function PerformanceRankingChart(props) {
  const [data, setData] = useState({
    data1: [],
    data2: [],
  });
  const [unit, setUnit] = useState("");
  const series = [
    {
      name: "yield",
      data: data.data1,
    },
  ];
  const options = {
    chart: {
      //height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "10%",
        endingShape: "rounded",
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    colors: ["#0c8fb9"],
    tooltip: {
      y: {
        formatter: (value) => {
          return value;
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return props.measurement === "Yield" ? val + " h" : val + " %";
      },
      offsetY: -20,
      style: {
        fontSize: "15px",
        colors: ["white"],
      },
    },
    tooltip: {
      y: {
        formatter: (val) => {
          return props.measurement === "Yield" ? val + " h" : val + " %";
        },
      },
    },
    labels: data.data2,
    grid: {
      show: false,
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
          show: false,
          style: {
            colors: "#90A4AE",
          },
        },
      },
    ],
  };
  let year = props.date.split("-")[0];
  let month = props.date.split("-")[1];
  let day = props.date.split("-")[2];
  let interval;
  const [inter, setInter] = useState(true);
  useEffect(() => {
    const getData = () => {
      let user = getUser();
      if (props.timeselect === "Day") {
        axios
          .get(`/leaderboard/performanceranking`, {
            params: {
              siteids: user.siteid,
              time: "day",
              date: year + "," + month + "," + day,
              measurement: props.measurement,
            },
          })
          .then((response) => setData(response.data));
      }
      if (props.timeselect === "Month") {
        axios
          .get(`/leaderboard/performanceranking`, {
            params: {
              siteids: user.siteid,
              time: "day",
              date: year + "," + month,
              measurement: props.measurement,
            },
          })
          .then((response) => setData(response.data));
      }
      if (props.timeselect === "Year") {
        axios
          .get(`/leaderboard/performanceranking`, {
            params: {
              siteids: user.siteid,
              time: "year",
              date: year,
              measurement: props.measurement,
            },
          })
          .then((response) => setData(response.data));
      }
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
  }, [props.date, props.timeselect]);
  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height="100%"
    />
  );
}
