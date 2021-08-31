import React, { useEffect } from "react";
import "./MeterDetailProduction.css";
import ReactApexChart from "react-apexcharts";
import { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import axios from "axios";
import config from "../../../../../../config.json";
export default function MeterDetailProduction(props) {
  const [typeColumn, setTypeColumn] = useState(true);
  const [data, setData] = useState({
    data1: [],
    data2: [],
    data3: [],
  });
  const series = [
    {
      name: "Production",
      type: typeColumn ? "column" : "line",
      data: data.data1,
    },
    {
      name: "Irradiance",
      type: typeColumn ? "column" : "line",
      data: data.data2,
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
        columnWidth: "50%",
      },
    },
    colors: ["#04cfd2", "#ffd25c"],
    stroke: {
      show: true,
      width: [2, 2],
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
      tickAmount: 15,
    },
    yaxis: [
      {
        title: {
          text: "kWh",
          offsetX: 20,
          offsetY: -110,
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
          text: "W/㎡",
          offsetX: -20,
          offsetY: -110,
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
    if (value2.EnergyMeterProduction !== null) {
      value2.EnergyMeterProduction.map((item, index) => {
        data1.push(roundfunction(item.v));
        data3.push(item.t);
      });
    }
    if (value1.GHI !== null) {
      value1.GHI.map((item, index) => {
        data2.push(roundfunction(item.v));
      });
    }
    setData({
      data1: data1,
      data2: data2,
      data3: data3,
    });
  };
  let interval;
  const [inter, setInter] = useState(true);
  let datevar = formatDate(new Date());
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
        const [secondResponse] = await Promise.all([
          axios
            .get(`${config.SERVER_URL}/entitygetrecordsdaily`, {
              params: {
                id: firstResponse[0].id,
                attrs: "GHI",
                interval: "5m",
                date: year + "," + month + "," + day,
              },
            })
            .then((response) => response.data),
        ]);
        const [thirdResponse] = await Promise.all([
          axios
            .get(`${config.SERVER_URL}/entitygetrecordsdaily`, {
              params: {
                id: props.meterid,
                attrs: "EnergyMeterProduction",
                interval: "5m",
                date: year + "," + month + "," + day,
              },
            })
            .then((response) => response.data),
        ]);
        handleData(secondResponse, thirdResponse);
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
  }, []);
  return (
    <div className="meter-detail-production">
      <header onClick={() => setTypeColumn(!typeColumn)}>
        <span>Production</span>
        <span>
          {typeColumn && <FaIcons.FaRegChartBar />}
          {!typeColumn && <RiIcons.RiLineChartLine />}
        </span>
      </header>
      <section>
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={270}
        />
      </section>
    </div>
  );
}
