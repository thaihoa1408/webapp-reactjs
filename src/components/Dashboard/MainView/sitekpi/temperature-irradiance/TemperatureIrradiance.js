import React, { useEffect, useState } from "react";
import "./TemperatureIrradiance.css";
import * as RiIcons from "react-icons/ri";
import axios from "axios";
import config from "../../../../../config.json";
export default function TemperatureIrradiance(props) {
  const [timeDisplay, setTimeDisplay] = useState(false);

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
  const [inter, setInter] = useState(true);
  const [temperature, setTemperature] = useState();
  const [irradiance, setIrradiance] = useState();
  const handleData = (data) => {
    if (data.GHI !== null && data.GHI.length !== 0) {
      setIrradiance(roundfunction(data.GHI[0].last.v));
    } else {
      setIrradiance(null);
    }
    if (
      data.AmbientTemperature !== null &&
      data.AmbientTemperature.length !== 0
    ) {
      setTemperature(roundfunction(data.AmbientTemperature[0].last.v));
    } else {
      setTemperature(null);
    }
  };
  let interval;
  let datevar = formatDate(new Date());
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  useEffect(() => {
    const getData = async () => {
      const [firstResponse] = await Promise.all([
        axios
          .get(`/entityget?ancestor=${props.siteid}&kind=WeatherStation`)
          .then((response) => response.data),
      ]);
      if (firstResponse.length === 0 || props.date !== formatDate(new Date())) {
        setInter(false);
      } else {
        setInter(true);
      }
      if (firstResponse.length) {
        const [secondResponse] = await Promise.all([
          axios
            .get(`/entitygetrecords`, {
              params: {
                id: firstResponse[0].id,
                attrs: "GHI,AmbientTemperature",
                interval: "day",
                filter: "first,last",
                date: year + "," + month + "," + day,
              },
            })
            .then((response) => response.data),
        ]);
        handleData(secondResponse);
      } else {
        setTemperature(null);
        setIrradiance(null);
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
  }, [props.siteid, inter, props.date]);
  return (
    <div className="temperature-irradiance">
      <div>
        <div
          className="temperature-irradiance-time-display"
          onClick={() => {
            setTimeDisplay(!timeDisplay);
          }}
          tabIndex="0"
          onBlur={() => setTimeDisplay(false)}
        >
          <div>{props.timeSelect}</div>
          <div>
            <RiIcons.RiArrowDownSFill />
          </div>
        </div>
        {timeDisplay && (
          <div
            className="temperature-irradiance-time-dropdown"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div
              onClick={() => {
                setTimeDisplay(false);
                props.handleTimeSelect("Day");
              }}
            >
              Day
            </div>
            <div
              onClick={() => {
                setTimeDisplay(false);
                props.handleTimeSelect("Month");
              }}
            >
              Month
            </div>
            <div
              onClick={() => {
                setTimeDisplay(false);
                props.handleTimeSelect("Year");
              }}
            >
              Year
            </div>
          </div>
        )}
      </div>
      <div>
        <h4>{props.sitename}</h4>
      </div>
      <div>
        <div>
          <div>{temperature}℃</div>
          <div>Temperature</div>
        </div>
        <div>
          <div>{irradiance} W/㎡</div>
          <div>Irradiance</div>
        </div>
      </div>
    </div>
  );
}
