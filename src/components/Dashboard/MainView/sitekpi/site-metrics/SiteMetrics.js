import React, { useEffect, useState } from "react";
import "./SiteMetrics.css";
import pic1 from "./pic/1.png";
import pic2 from "./pic/2.png";
import pic3 from "./pic/3.png";
import axios from "axios";
import config from "../../../../../config.json";
export default function SiteMetrics(props) {
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  const [inter, setInter] = useState(true);
  const [data, setData] = useState({
    siteproduction: null,
    siteyield: null,
  });
  let interval;
  const roundfunction = (value) => {
    if (value === null) {
      return null;
    } else {
      return Math.round(value * 100) / 100;
    }
  };
  let datevar = formatDate(new Date());
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  useEffect(() => {
    const getData = () => {
      if (props.timeselect === "Day") {
        axios
          .get(`/sitekpi/metric`, {
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
          .get(`/sitekpi/metric`, {
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
          .get(`/sitekpi/metric`, {
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
    <div className="site-metrics">
      <div className="site-metrics-container">
        <div className="site-metrics-header">Site Metrics</div>
        <div className="site-metrics-body">
          <div>
            <div>Production</div>
            <div>
              <img src={pic1} />
            </div>
            <div>{roundfunction(data.siteproduction / 1000)} MWh</div>
          </div>
          <div>
            <div>Yield</div>
            <div>
              <img src={pic2} />
            </div>
            <div>{data.siteyield} h</div>
          </div>
          <div>
            <div>CO₂ Reduction</div>
            <div>
              <img src={pic3} />
            </div>
            <div> t</div>
          </div>
        </div>
      </div>
    </div>
  );
}
