import React, { useEffect, useState } from "react";
import "./ProductionRatio.css";
import pic1 from "./pic/1.png";
import pic2 from "./pic/2.png";
import axios from "axios";
import config from "../../../../../config.json";
export default function ProductionRatio(props) {
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  const [data, setData] = useState({
    inverterProduction: null,
    siteProduction: null,
    percent: null,
  });
  const roundfunction = (value) => {
    if (value === null) {
      return null;
    } else {
      return Math.round(value * 100) / 100;
    }
  };
  let interval;
  const [inter, setInter] = useState(true);
  let datevar = formatDate(new Date());
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  useEffect(() => {
    const getData = () => {
      if (props.timeselect === "Day") {
        axios
          .get(`/siteview/productioninfor`, {
            params: {
              siteid: props.siteid,
              time: "day",
              date: year + "," + month + "," + day,
            },
          })
          .then((response) => setData(response.data));
      }
      if (props.timeselect === "Month") {
        axios
          .get(`/siteview/productioninfor`, {
            params: {
              siteid: props.siteid,
              time: "month",
              date: year + "," + month,
            },
          })
          .then((response) => setData(response.data));
      }
      if (props.timeselect === "Year") {
        axios
          .get(`/siteview/productioninfor`, {
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
  }, [props.siteid, inter, props.timeselect]);
  return (
    <div className="production-ratio">
      <div className="production-ratio-container">
        <div className="production-ratio-header">Production</div>
        <div className="production-ratio-body">
          <div>
            <div>Inverter</div>
            <div>
              <img src={pic1} />
            </div>
            <div>{roundfunction(data.inverterProduction / 1000)} MWh</div>
          </div>
          <div>
            <div>{data.percent} %</div>
          </div>
          <div>
            <div>Energy Meter</div>
            <div>
              <img src={pic2} />
            </div>
            <div>{roundfunction(data.siteProduction / 1000)} MWh</div>
          </div>
        </div>
      </div>
    </div>
  );
}
