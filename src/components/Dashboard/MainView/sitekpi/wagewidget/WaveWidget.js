import React, { useEffect, useState } from "react";
import "./WaveWidget.css";
import * as AiIcons from "react-icons/ai";
import axios from "axios";
import config from "../../../../../config.json";
function WaveWidget(props) {
  const [select, setSelect] = useState(false);
  const handleSelect = () => {
    setSelect(!select);
  };
  const [name, setName] = useState("Production");
  const [list, setList] = useState([true, false]);
  const handleSetlist = (id) => {
    if (id === 0) {
      setList([true, false]);
      setName("Production");
      setSelect(!select);
    } else if (id === 1) {
      setList([false, true]);
      setName("Yield");
      setSelect(!select);
    }
  };
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };

  const [data, setData] = useState({
    siteproduction: null,
    siteyield: null,
  });
  const roundfunction = (value) => {
    if (value === null) {
      return null;
    } else {
      return Math.round(value * 100) / 100;
    }
  };
  const [inter, setInter] = useState(true);
  let interval;
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
    <div className="box-wave">
      <div className="wave-header">
        <div>{name}</div>
        <AiIcons.AiOutlineSetting
          className={select ? "setting-icon active" : "setting-icon"}
          onClick={handleSelect}
        />
      </div>
      <div className={select ? "dropdown-list" : "dropdown-list-inactive"}>
        <div>
          <div>
            <div
              className={list[0] ? "icon-click active" : "icon-click"}
              onClick={() => handleSetlist(0)}
            ></div>
            <div>Production</div>
          </div>
          <div>
            <div
              className={list[1] ? "icon-click active" : "icon-click"}
              onClick={() => handleSetlist(1)}
            ></div>
            <div>Yield</div>
          </div>
        </div>
      </div>
      <div className="wave-body">
        <svg className="wave" viewBox="0 0 1320 100">
          <path
            fill-opacity="0.7"
            d="
                M0,192
                C220,100,440,100,660,192
                C880,290,1100,290,1320,192
                L1320 500
                L0 500
                "
            fill="#000"
          />
          <path
            fill-opacity="0.7"
            d="
                M0,192
                C220,100,440,100,660,192
                C880,290,1100,290,1320,192
                L1320 500
                L0 500
                "
            fill="#fff"
          />
          <path
            fill-opacity="0.7"
            d="
                M0,192
                C220,100,440,100,660,192
                C880,290,1100,290,1320,192
                L1320 500
                L0 500
                "
            fill="#ee5253"
          />
          <path
            fill-opacity="0.7"
            d="
                M0,192
                C220,100,440,100,660,192
                C880,290,1100,290,1320,192
                L1320 500
                L0 500
                "
            fill="#00d2d3"
          />
        </svg>
        <div className={list[0] ? "tit" : "tit-inactive"}>
          <div>{roundfunction(data.siteproduction / 1000)}</div>
          <div>MWh</div>
        </div>
        <div className={list[1] ? "tit" : "tit-inactive"}>
          <div>{data.siteyield}h</div>
        </div>
      </div>
    </div>
  );
}

export default WaveWidget;
