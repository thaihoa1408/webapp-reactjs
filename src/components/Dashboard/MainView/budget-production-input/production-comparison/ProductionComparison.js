import React, { useEffect, useState } from "react";
import "./ProductionComparison.css";
import * as RiIcons from "react-icons/ri";
import * as GoIcons from "react-icons/go";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import config from "../../../../../config.json";
export default function ProductionComparison(props) {
  const [timeSelect, setTimeSelect] = useState("Year");
  const [timeSelectDisplay, setTimeSelectDisplay] = useState(false);
  const [date, setDate] = useState(new Date());
  const [calendarDisplay, setCalendarDisplay] = useState(false);
  const handleSetDate = (date) => {
    setDate(date);
  };
  let yyyy = date.getFullYear();
  //
  const [data, setData] = useState({
    actualProduction: [],
    budgetProduction: [],
    completionRate: [],
    label: [
      "Jan",
      "Feb",
      "Mar",
      "April",
      "May",
      "June",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
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
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    stroke: {
      width: [3, 3, 3],
      colors: ["transparent", "transparent", "#ffd25c"],
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
        seriesName: "Actual Production",
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
  useEffect(() => {
    const getData = async () => {
      axios
        .get(`/siteview/linecolumnchart2`, {
          params: {
            siteid: props.siteid,
            date: yyyy,
          },
        })
        .then((response) => setData(response.data));
    };
    getData();
  }, [date, props.siteid]);
  return (
    <div className="production-comparison">
      <header>Production Comparison</header>
      <section>
        <div className="row-1">
          <div>
            <div
              onClick={() => {
                setTimeSelectDisplay(!timeSelectDisplay);
              }}
              tabIndex="0"
              onBlur={() => setTimeSelectDisplay(false)}
            >
              <span>{timeSelect}</span>
              <span>
                <RiIcons.RiArrowDownSFill />
              </span>
            </div>
            {timeSelectDisplay && (
              <div onMouseDown={(e) => e.preventDefault()}>
                <div
                  onClick={() => {
                    setTimeSelect("Year");
                    setTimeSelectDisplay(false);
                  }}
                >
                  Year
                </div>
                <div
                  onClick={() => {
                    setTimeSelect("Total");
                    setTimeSelectDisplay(false);
                  }}
                >
                  Total
                </div>
              </div>
            )}
          </div>
          {timeSelect === "Year" && (
            <div>
              <div
                onClick={() => {
                  setCalendarDisplay(!calendarDisplay);
                }}
                tabIndex="0"
                onBlur={() => setCalendarDisplay(false)}
              >
                <span>{yyyy}</span>
                <span>
                  <GoIcons.GoCalendar />
                </span>
              </div>
              {calendarDisplay && (
                <div onMouseDown={(e) => e.preventDefault()}>
                  <Calendar
                    onChange={handleSetDate}
                    defaultView="decade"
                    maxDetail="decade"
                    value={date}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="row-2">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height="95%"
          />
        </div>
      </section>
    </div>
  );
}
