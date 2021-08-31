import React, { useEffect, useState } from "react";
import "./LineChart.css";
import { Bar, Line, Pie } from "react-chartjs-2";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import config from "../../../../../../config.json";
function LineChart2(props) {
  const [data, setData] = useState({
    actualIrradiation: [],
    theoreticalIrradiation: [],
    yield: [],
    label: [],
  });
  const series = [
    {
      name: "Actual Irradiation",
      type: "column",
      data: data.actualIrradiation,
    },
    {
      name: "Theoretical Irradiation",
      type: "column",
      data: data.theoreticalIrradiation,
    },
    {
      name: "Yield",
      type: "line",
      data: data.yield,
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
      showForSingleSeries: true,
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
        seriesName: "Actual Irradiation",
        opposite: false,
        title: {
          text: "Wh/m²",
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
        seriesName: "Actual Irradiation",
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
        seriesName: "Yield",
        opposite: true,
        title: {
          text: "h",
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
            return val + " Wh/m²";
          },
        },
        {
          formatter: function (val) {
            return val + " Wh/m²";
          },
        },
        {
          formatter: function (val) {
            return val + " h";
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
        .get(`/siteview/linechart2`, {
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
export default LineChart2;
