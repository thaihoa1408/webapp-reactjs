import React, { useEffect, useState } from "react";
import "./InverterDetailProduction.css";
import * as RiIcons from "react-icons/ri";
import * as GoIcons from "react-icons/go";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import config from "../../../../../../config.json";
export default function InverterDetailProduction(props) {
  //time select (Day, Month, Year)
  const [timeSelect, setTimeSelect] = useState("Day");
  const [timeSelectDisplay, setTimeSelectDisplay] = useState(false);
  const handleSetTimeSelect = (value) => {
    setTimeSelect(value);
    setTimeSelectDisplay(false);
    setCalendarDisplay(false);
    setDate(new Date());
  };
  // calendar
  const [date, setDate] = useState(new Date());
  const [calendarDisplay, setCalendarDisplay] = useState(false);
  const handleSetDate = (date) => {
    setDate(date);
  };
  let dd = String(date.getDate()).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = date.getFullYear();
  let dateformat = null;
  if (timeSelect === "Day") {
    dateformat = yyyy + "/" + mm + "/" + dd;
  } else if (timeSelect === "Month") dateformat = yyyy + "/" + mm;
  else dateformat = yyyy;
  //
  const [data, setData] = useState({
    data1: [],
    data2: [],
    data3: [],
  });
  const series = [
    {
      name: "Production",
      type: "column",
      data: data.data1,
    },
    {
      name: "Irradiation",
      type: "column",
      data: data.data2,
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
        columnWidth: "60%",
        endingShape: "rounded",
      },
    },
    colors: ["#04cfd2", "#ffd25c"],
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
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
    labels: data.data3,
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
        opposite: true,
        title: {
          text: "Wh/㎡",
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
  };
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  const roundfunction = (value) => {
    if (value === null) {
      return null;
    } else {
      return Math.round(value * 100) / 100;
    }
  };
  const handleData = (value1, value2) => {
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let prevalue;
    let sign1 = false;
    let sign2 = false;
    if (timeSelect === "Day") {
      if (value2.InverterProduction !== null) {
        value2.InverterProduction.map((item, index) => {
          if (item.v === null) {
            data1.push(item.v);
          } else {
            if (sign1 === false) {
              data1.push(item.v - item.v);
              sign1 = true;
            } else {
              data1.push(roundfunction(item.v - prevalue));
            }
            prevalue = item.v;
          }
          data3.push(item.t);
        });
      }
      if (value1.Irradiation !== null) {
        value1.Irradiation.map((item, index) => {
          if (item.v === null) {
            data2.push(item.v);
          } else {
            if (sign2 === false) {
              data2.push(item.v - item.v);
              sign2 = true;
            } else {
              data2.push(roundfunction(item.v - prevalue));
            }
            prevalue = item.v;
          }
        });
      }
    } else {
      if (value2.InverterProduction !== null) {
        value2.InverterProduction.map((item, index) => {
          data1.push(roundfunction(item.v));
          data3.push(item.t);
        });
      }
      if (value1.Irradiation !== null) {
        value1.Irradiation.map((item, index) => {
          data2.push(roundfunction(item.v));
        });
      }
    }
    setData({
      data1: data1,
      data2: data2,
      data3: data3,
    });
  };
  const [inter, setInter] = useState(true);
  let interval;
  let datevar = formatDate(date);
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  useEffect(() => {
    const getData = async () => {
      const [firstResponse] = await Promise.all([
        axios
          .get(
            `${config.SERVER_URL}/entityget?ancestor=${props.siteid}&kind=WeatherStation`
          )
          .then((response) => response.data),
      ]);
      if (firstResponse.length) {
        if (timeSelect === "Day") {
          const [secondResponse] = await Promise.all([
            axios
              .get(`${config.SERVER_URL}/entitygetrecordsdaily`, {
                params: {
                  id: firstResponse[0].id,
                  attrs: "Irradiation",
                  interval: "60m",
                  date: year + "," + month + "," + day,
                },
              })
              .then((response) => response.data),
          ]);
          const [thirdResponse] = await Promise.all([
            axios
              .get(`${config.SERVER_URL}/entitygetrecordsdaily`, {
                params: {
                  id: props.inverterid,
                  attrs: "InverterProduction",
                  interval: "60m",
                  date: year + "," + month + "," + day,
                },
              })
              .then((response) => response.data),
          ]);
          handleData(secondResponse, thirdResponse);
        }
        if (timeSelect === "Month") {
          const [secondResponse] = await Promise.all([
            axios
              .get(`${config.SERVER_URL}/entitygetrecordsmonthly`, {
                params: {
                  id: firstResponse[0].id,
                  attrs: "Irradiation",
                  month: year + "," + month,
                },
              })
              .then((response) => response.data),
          ]);
          const [thirdResponse] = await Promise.all([
            axios
              .get(`${config.SERVER_URL}/entitygetrecordsmonthly`, {
                params: {
                  id: props.inverterid,
                  attrs: "InverterProduction",
                  month: year + "," + month,
                },
              })
              .then((response) => response.data),
          ]);
          handleData(secondResponse, thirdResponse);
        }
        if (timeSelect === "Year") {
          const [secondResponse] = await Promise.all([
            axios
              .get(`${config.SERVER_URL}/entitygetrecordsyearly`, {
                params: {
                  id: firstResponse[0].id,
                  attrs: "Irradiation",
                  year: year,
                },
              })
              .then((response) => response.data),
          ]);
          const [thirdResponse] = await Promise.all([
            axios
              .get(`${config.SERVER_URL}/entitygetrecordsyearly`, {
                params: {
                  id: props.inverterid,
                  attrs: "InverterProduction",
                  year: year,
                },
              })
              .then((response) => response.data),
          ]);
          handleData(secondResponse, thirdResponse);
        }
      } else {
        setData({ data1: [], data2: [], data3: [] });
      }
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
  }, [date, timeSelect]);
  return (
    <div className="inverter-detail-production">
      <header className="inverter-detail-production-header">
        <div>Production</div>
        <div className="timeselect">
          <div
            onClick={() => {
              setTimeSelectDisplay(!timeSelectDisplay);
            }}
            tabIndex="0"
            onBlur={() => setTimeSelectDisplay(false)}
          >
            <div>{timeSelect}</div>
            <div>
              <RiIcons.RiArrowDownSFill />
            </div>
          </div>
          {timeSelectDisplay && (
            <div onMouseDown={(e) => e.preventDefault()}>
              <div
                onClick={() => {
                  handleSetTimeSelect("Day");
                }}
              >
                Day
              </div>
              <div
                onClick={() => {
                  handleSetTimeSelect("Month");
                }}
              >
                Month
              </div>
              <div
                onClick={() => {
                  handleSetTimeSelect("Year");
                }}
              >
                Year
              </div>
            </div>
          )}
        </div>
        <div className="calendar">
          <div
            onClick={() => {
              setCalendarDisplay(!calendarDisplay);
            }}
            tabIndex="0"
            onBlur={() => setCalendarDisplay(false)}
          >
            <div>{dateformat}</div>
            <div>
              <GoIcons.GoCalendar />
            </div>
          </div>
          {calendarDisplay && (
            <div onMouseDown={(e) => e.preventDefault()}>
              <Calendar
                onChange={handleSetDate}
                value={date}
                defaultView={
                  timeSelect === "Day"
                    ? "month"
                    : timeSelect === "Month"
                    ? "year"
                    : "decade"
                }
                maxDetail={
                  timeSelect === "Day"
                    ? "month"
                    : timeSelect === "Month"
                    ? "year"
                    : "decade"
                }
              />
            </div>
          )}
        </div>
      </header>
      <section className="inverter-detail-production-section">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </section>
    </div>
  );
}
