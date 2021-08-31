import React, { useEffect, useState } from "react";
import LineChart from "./line-chart/LineChart";
import LineChart1 from "./line-chart/LineChart1";
import LineChart2 from "./line-chart/LineChart2";
import LineColumnChart from "./line-column-chart/LineColumnChart";
import LineColumnChart1 from "./line-column-chart/LineColumnChart1";
import LineColumnChart2 from "./line-column-chart/LineColumnChart2";
import "./SiteviewChart.css";
import config from "../../../../../config.json";
import axios from "axios";
export default function SiteviewChart(props) {
  const [data, setData] = useState({
    production: null,
    yield: null,
    irradiation: null,
    powerratio: null,
  });
  let year = props.date.split("-")[0];
  let month = props.date.split("-")[1];
  let day = props.date.split("-")[2];
  let interval;
  const [inter, setInter] = useState(true);
  useEffect(() => {
    const getData = () => {
      if (props.select[0]) {
        axios
          .get(`/siteview/chartinfor`, {
            params: {
              siteid: props.siteid,
              time: "day",
              date: year + "," + month + "," + day,
            },
          })
          .then((response) => setData(response.data));
      }
      if (props.select[1]) {
        axios
          .get(`/siteview/chartinfor`, {
            params: {
              siteid: props.siteid,
              time: "month",
              date: year + "," + month,
            },
          })
          .then((response) => setData(response.data));
      }
      if (props.select[2]) {
        axios
          .get(`/siteview/chartinfor`, {
            params: {
              siteid: props.siteid,
              time: "year",
              date: year,
            },
          })
          .then((response) => setData(response.data));
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
  }, [props.siteid, props.date, props.select]);
  return (
    <div className="siteview-chart">
      <div className="siteview-chart-header">
        <div>Capacity {props.capacity} MWp</div>
        <div>Irradiation {data.irradiation / 1000} kWh/㎡</div>
        <div>Yield {data.yield} h</div>
        <div>Production {data.production / 1000} MWh</div>
        <div>
          {props.select[0] ? "Power Ratio" : "PR"} {data.powerratio} %
        </div>
      </div>
      <div className="siteview-chart-body">
        {props.select[0] && (
          <LineColumnChart siteid={props.siteid} date={props.date} />
        )}
        {props.select[0] && (
          <LineChart siteid={props.siteid} date={props.date} />
        )}
        {props.select[1] && (
          <LineColumnChart1
            siteid={props.siteid}
            date={props.date}
            capacity={props.capacity}
          />
        )}
        {props.select[1] && (
          <LineChart1
            siteid={props.siteid}
            date={props.date}
            capacity={props.capacity}
          />
        )}
        {props.select[2] && (
          <LineColumnChart2
            siteid={props.siteid}
            date={props.date}
            capacity={props.capacity}
          />
        )}
        {props.select[2] && (
          <LineChart2
            siteid={props.siteid}
            date={props.date}
            capacity={props.capacity}
          />
        )}
      </div>
    </div>
  );
}
