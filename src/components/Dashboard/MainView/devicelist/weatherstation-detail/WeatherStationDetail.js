import React, { useEffect } from "react";
import "./WeatherStationDetail.css";
import pic1 from "./pic/1.svg";
import { useState } from "react";
import axios from "axios";
import config from "../../../../../config.json";
export default function WeatherStationDetail(props) {
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
  const [irradiation, setIrradiation] = useState();
  const [poa, setPoa] = useState();
  const [ghi, setGhi] = useState();
  const [ambientTemp, setAmbientTemp] = useState();
  const [moduleTemp, setModuleTemp] = useState();
  const [windSpeed, setWindSpeed] = useState();
  const [windDirection, setWindDirection] = useState();
  const [humidity, setHumidity] = useState();
  const [rainfall, setRainfall] = useState();
  const [operationState, setOperationState] = useState();
  const [name, setName] = useState();
  const handleData = (data) => {
    if (data.Irradiation !== null && data.Irradiation.length !== 0) {
      setIrradiation(roundfunction(data.Irradiation[0].last.v));
    }
    if (data.POA !== null && data.POA.length !== 0) {
      setPoa(data.POA[0].last.v);
    }
    if (data.GHI !== null && data.GHI.length !== 0) {
      setGhi(roundfunction(data.GHI[0].last.v));
    }
    if (
      data.AmbientTemperature !== null &&
      data.AmbientTemperature.length !== 0
    ) {
      setAmbientTemp(roundfunction(data.AmbientTemperature[0].last.v));
    }
    if (
      data.ModuleTemperature !== null &&
      data.ModuleTemperature.length !== 0
    ) {
      setModuleTemp(roundfunction(data.ModuleTemperature[0].last.v));
    }
    if (data.WindSpeed !== null && data.WindSpeed.length !== 0) {
      setWindSpeed(roundfunction(data.WindSpeed[0].last.v));
    }
    if (data.WindDirection !== null && data.WindDirection.length !== 0) {
      setWindDirection(roundfunction(data.WindDirection[0].last.v));
    }
    if (data.Humidity !== null && data.Humidity.length !== 0) {
      setHumidity(roundfunction(data.Humidity[0].last.v));
    }
    if (data.Rainfall !== null && data.Rainfall.length !== 0) {
      setRainfall(roundfunction(data.Rainfall[0].last.v));
    }
    if (
      data.WeatherStationState !== null &&
      data.WeatherStationState.length !== 0
    ) {
      setOperationState(data.WeatherStationState[0].last.v);
    }
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
          .get(`${config.SERVER_URL}/entityget?id=${props.weatherstationid}`)
          .then((response) => response.data),
      ]);
      setName(firstResponse.name);
      const [secondResponse] = await Promise.all([
        axios
          .get(`${config.SERVER_URL}/entitygetrecords`, {
            params: {
              id: props.weatherstationid,
              attrs:
                "Irradiation,POA,GHI,AmbientTemperature,ModuleTemperature,Humidity,WindSpeed,WindDirection,Rainfall,WeatherStationState",
              interval: "day",
              filter: "first,last",
              date: year + "," + month + "," + day,
            },
          })
          .then((response) => response.data),
      ]);
      handleData(secondResponse);
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
    <div className="weather-station-detail">
      <div className="weather-station-detail-background"></div>
      <div className="weather-station-detail-header">{props.sitename}</div>
      <div className="weather-station-detail-body">
        <div className="weather-station-detail-body-row-1">
          <span
            onClick={() => {
              props.handleSetWeatherstationDetailDisplay(false);
            }}
          >
            List
          </span>
          <span>{">"}</span>
          <span>Details</span>
        </div>
        <div className="weather-station-detail-body-row-2">
          <div className="row-1">
            <div>{name}</div>
            <div></div>
            <div>Full Capacity</div>
          </div>
        </div>
        <div className="weather-station-detail-body-row-3">
          <header>General Indicator</header>
          <section>
            <div>
              <div>
                <div>Total Irradiation</div>
                <div>{irradiation} Wh/m²</div>
              </div>
              <div>
                <div>POA</div>
                <div>{poa} Wh/m²</div>
              </div>
              <div>
                <div>GHI</div>
                <div>{ghi} Wh/m²</div>
              </div>
            </div>
            <div>
              <img src={pic1} />
            </div>
            <div>
              <div>
                <div>
                  Wind Speed <span>{windSpeed} m/s</span>
                </div>
                <div>
                  Wind Direction <span>{windDirection} °</span>
                </div>
              </div>
              <div>
                <div>
                  Humidity <span>{humidity} %</span>
                </div>
                <div>
                  Rainfall <span>{rainfall} mm</span>
                </div>
              </div>
              <div>
                <div>
                  Ambient Temperature <span>{ambientTemp} ℃</span>
                </div>
                <div>
                  Module Temperature <span>{moduleTemp} ℃</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
