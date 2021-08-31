import React from "react";
import { useState } from "react";
import "./InverterDetailDeviation.css";
import ReactApexChart from "react-apexcharts";
import { useEffect } from "react";
import axios from "axios";
import config from "../../../../../../config.json";
export default function InverterDetailDeviation(props) {
  const [select, setSelect] = useState([false, true]);
  const handleSetSelect = (value) => {
    if (value === 0) {
      setSelect([true, false]);
    }
    if (value === 1) {
      setSelect([false, true]);
    }
  };
  //
  const [data, setData] = useState({
    data1: [null, null, 95, 95, 95, 90, 92, 93, 95, 94, 96],
    data2: [1, 2, 3, 4, 5, 6, 5, 4, 4, 3, 2],
    data3: [2, 2.5, 3.1, 4, 5.2, 5.8, 5.2, 4.3, 4.2, 3.5, 1.8],
    data4: [2, 2.5, 3.1, 4, 5.2, 5.8, 5.2, 4.3, 4.2, 3.5, 1.8],
    data5: [2.1, 2.6, 3.0, 4.2, 5.4, 5.6, 5.2, 4.1, 4.0, 3.0, 1.6],
    data6: [2.1, 2.6, 3.2, 4.1, 5.4, 5.9, 5.2, 4.4, 4.0, 3.0, 1.5],
    data7: [2.1, 2.6, 3.2, 4.1, 5.3, 5.9, 5.7, 4.6, 4.2, 3.5, 1.8],
    data8: [2.1, 2.6, 3.1, 4.1, 5.3, 5.9, 5.7, 4.5, 4.1, 3.8, 2.0],
    data9: [2.1, 2.6, 3.2, 4.5, 5.3, 5.9, 5.7, 4.6, 4.2, 3.5, 1.8],
    data10: [2.1, 2.6, 3.0, 4.1, 5.1, 5.8, 5.7, 4.6, 4.2, 3.5, 1.8],
    data11: [2.1, 2.6, 3.0, 4.1, 5.1, 5.8, 5.7, 4.6, 4.2, 3.5, 1.8],
    data12: [2.1, 2.6, 3.0, 4.1, 5.1, 5.8, 5.7, 4.6, 4.2, 3.5, 1.8],
    data13: [2.1, 2.6, 3.0, 4.1, 5.1, 5.8, 5.7, 4.6, 4.2, 3.5, 1.8],
    data14: [2.1, 2.6, 3.0, 4.1, 5.1, 5.8, 5.7, 4.6, 4.2, 3.5, 1.8],
    data15: [2.1, 2.6, 3.0, 4.1, 5.1, 5.8, 5.7, 4.6, 4.2, 3.5, 1.8],
    data16: [2.1, 2.6, 3.0, 4.1, 5.1, 5.8, 5.7, 4.6, 4.2, 3.5, 1.8],
    data17: [2.1, 2.6, 3.0, 4.1, 5.1, 5.8, 5.7, 4.6, 4.2, 3.5, 1.8],
    data18: [2.1, 2.6, 3.0, 4.1, 5.1, 5.8, 5.7, 4.6, 4.2, 3.5, 1.8],
    data19: [2.1, 2.6, 3.0, 4.1, 5.1, 5.8, 5.7, 4.6, 4.2, 3.5, 1.8],
    data20: [2.1, 2.6, 3.0, 4.1, 5.1, 5.8, 5.7, 4.6, 4.2, 3.5, 1.8],
    data21: [2.1, 2.6, 3.0, 4.1, 5.1, 5.8, 5.7, 4.6, 4.2, 3.5, 1.8],
    label: [
      "06:00",
      "06:05",
      "06:10",
      "06:15",
      "06:20",
      "06:25",
      "06:30",
      "06:35",
      "06:40",
      "06:45",
      "06:50",
    ],
  });
  const series = [
    {
      name: "Deviation",
      type: "line",
      data: data.data1,
      color: "#d0ff00",
    },
    {
      name: "01",
      type: "line",
      data: data.data2,
    },
    {
      name: "02",
      type: "line",
      data: data.data3,
    },
    {
      name: "03",
      type: "line",
      data: data.data4,
    },
    {
      name: "04",
      type: "line",
      data: data.data5,
    },
    {
      name: "05",
      type: "line",
      data: data.data6,
    },
    {
      name: "06",
      type: "line",
      data: data.data7,
    },
    {
      name: "07",
      type: "line",
      data: data.data8,
    },
    {
      name: "08",
      type: "line",
      data: data.data9,
    },
    {
      name: "09",
      type: "line",
      data: data.data10,
    },
    {
      name: "10",
      type: "line",
      data: data.data11,
    },
    {
      name: "11",
      type: "line",
      data: data.data12,
    },
    {
      name: "12",
      type: "line",
      data: data.data13,
    },
    {
      name: "13",
      type: "line",
      data: data.data14,
    },
    {
      name: "14",
      type: "line",
      data: data.data15,
    },
    {
      name: "15",
      type: "line",
      data: data.data16,
    },
    {
      name: "16",
      type: "line",
      data: data.data17,
    },
    {
      name: "17",
      type: "line",
      data: data.data18,
    },
    {
      name: "18",
      type: "line",
      data: data.data19,
    },
    {
      name: "19",
      type: "line",
      data: data.data20,
    },
    {
      name: "20",
      type: "line",
      data: data.data21,
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
    //colors: ["#00f9fc", ...[]],
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
          text: "(%)",
          offsetX: 20,
          offsetY: -140,
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
          text: "(A)",
          offsetX: -20,
          offsetY: -140,
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
  const [setting, setSetting] = useState(false);
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  let datevar = formatDate(new Date());
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  const roundfunction = (value) => {
    if (value === null) {
      return null;
    } else {
      return Math.round(value * 100) / 100;
    }
  };
  const [unusedNum, setUnusedNum] = useState(0);
  const handleStringCurrent = (data) => {
    let array = [];
    let unused = 0;
    for (let i = 1; i <= 20; i++) {
      let key = "InverterStringCurrent" + i.toString();
      if (data[`${key}`] !== null) {
        if (data[`${key}`].length !== 0) {
          array.push(roundfunction(data[`${key}`][0].last.v));
        } else {
          array.push(null);
        }
      } else {
        array.push(false);
        unused = unused + 1;
      }
    }
    setUnusedNum(unused);
    return array;
  };
  const [stringCurrentValue, setStringCurrentValue] = useState([]);
  let interval;
  const [inter, setInter] = useState(true);
  useEffect(() => {
    const getData = async () => {
      const [firstResponse] = await Promise.all([
        axios
          .get(`/entitygetrecords`, {
            params: {
              id: props.inverterid,
              attrs:
                "InverterStringCurrent1,InverterStringCurrent2,InverterStringCurrent3,InverterStringCurrent4,InverterStringCurrent5,InverterStringCurrent6,InverterStringCurrent7,InverterStringCurrent8,InverterStringCurrent9,InverterStringCurrent10,InverterStringCurrent11,InverterStringCurrent12,InverterStringCurrent13,InverterStringCurrent14,InverterStringCurrent15,InverterStringCurrent16,InverterStringCurrent17,InverterStringCurrent18,InverterStringCurrent19,InverterStringCurrent20",
              interval: "day",
              filter: "first,last",
              date: year + "," + month + "," + day,
            },
          })
          .then((response) => response.data),
      ]);
      setStringCurrentValue(handleStringCurrent(firstResponse));
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
    <div className="inverter-detail-deviation">
      <header className="inverter-detail-deviation-header">
        <div
          className={select[0] ? "active" : null}
          onClick={() => handleSetSelect(0)}
        >
          Deviation
        </div>
        <div
          className={select[1] ? "active" : null}
          onClick={() => handleSetSelect(1)}
        >
          String Current
        </div>
        <div></div>
      </header>
      <section className="inverter-detail-deviation-section">
        {select[0] && (
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={350}
          />
        )}
        {select[1] && (
          <div className="string-current-container">
            <div className={setting ? "inner-box-active" : "iner-box-inactive"}>
              <div className="string-current-front">
                <header>
                  <div>
                    <span>Abnormal</span>
                    <span>0/15</span>
                    <span>In Use</span>
                    <span>{20 - unusedNum}/20</span>
                  </div>
                  <div>
                    <div onClick={() => setSetting(true)}>Set</div>
                  </div>
                </header>
                <section>
                  {stringCurrentValue.map((item, index) => {
                    if (item === false) {
                      return (
                        <div>
                          <div>{index + 1}</div>
                          <div>Unused</div>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <div>{index + 1}</div>
                          <div>{item} A</div>
                        </div>
                      );
                    }
                  })}
                </section>
              </div>
              <div className="string-current-back">
                <header>
                  <div>
                    <span>Error</span>
                    <span>0/15</span>
                    <span>In Use</span>
                    <span>{20 - unusedNum}/20</span>
                  </div>
                  <div>
                    <div onClick={() => setSetting(false)}>Cancel</div>
                    <div onClick={() => setSetting(false)}>Ok</div>
                  </div>
                </header>
                <section>
                  <div>
                    <div>01</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>02</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>03</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>04</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>05</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>06</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>07</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>08</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>09</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>10</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>11</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>12</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>13</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>14</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>15</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>16</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>17</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>18</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>19</div>
                    <div>ON</div>
                  </div>
                  <div>
                    <div>20</div>
                    <div>ON</div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
