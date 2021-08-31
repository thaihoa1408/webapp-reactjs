import React, { useEffect, useState } from "react";
import "./OverviewToday.css";
import { useHistory } from "react-router-dom";
import * as BsIcons from "react-icons/bs";
import axios from "axios";
import config from "../../../../../config.json";
export default function OverviewToday(props) {
  let history = useHistory();
  //function is used to format date
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  const [inter, setInter] = useState(true);
  const [data, setData] = useState({
    production: null,
    yield: null,
    irradiation: null,
    power_ratio: null,
  });
  let interval;
  let datevar = formatDate(new Date());
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  useEffect(() => {
    const getData = async () => {
      axios
        .get(`/fleetview/overview`, {
          params: {
            siteid: props.siteid,
            time: "day",
            date: year + "," + month + "," + day,
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
  }, [props.siteid, inter]);
  return (
    <div className="overview-today">
      <div className="overview-today-header">Overview of Today</div>
      <div className="overview-today-body">
        <div>
          <div>
            <div>Power Ratio</div>
            <div>{data.power_ratio} %</div>
          </div>
          <div>
            <div>Yield</div>
            <div>{data.yield} h</div>
          </div>
        </div>
        <div>
          <div>
            <div>Production</div>
            <div>{data.production} MWh</div>
          </div>
          <div>
            <div>Irradiation</div>
            <div>{data.irradiation} Wh/㎡</div>
          </div>
        </div>
      </div>
      <div className="overview-today-footer">Shortcut Entrance</div>
      <div
        className="overview-today-shortcut"
        onClick={() => {
          history.push(`/dashboard/site-monitor/siteview/${props.siteid}`);
        }}
      >
        <div>Site View</div>
        <div>
          <BsIcons.BsArrowRight />
        </div>
      </div>
    </div>
  );
}
