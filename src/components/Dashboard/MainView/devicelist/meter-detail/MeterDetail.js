import React, { useEffect, useState } from "react";
import MeterDetailData from "./meter-detail-data/MeterDetailData";
import MeterDetailProductionStatistic from "./meter-detail-production-statistic/MeterDetailProductionStatistic";
import MeterDetailProduction from "./meter-detail-production/MeterDetailProduction";
import "./MeterDetail.css";
import axios from "axios";
import config from "../../../../../config.json";
export default function MeterDetail(props) {
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  const [name, setName] = useState();
  const [operationState, setOperationState] = useState();
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
          .get(`${config.SERVER_URL}/entityget?id=${props.meterid}`)
          .then((response) => response.data),
      ]);
      setName(firstResponse.name);
      const [secondResponse] = await Promise.all([
        axios
          .get(`${config.SERVER_URL}/entitygetrecords`, {
            params: {
              id: props.meterid,
              attrs: "EnergyMeterState",
              interval: "day",
              filter: "first,last",
              date: year + "," + month + "," + day,
            },
          })
          .then((response) => response.data),
      ]);
      if (
        secondResponse.EnergyMeterState !== null &&
        secondResponse.EnergyMeterState.length !== 0
      ) {
        setOperationState(secondResponse.EnergyMeterState[0].last.v);
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
    <div className="meter-detail">
      <div className="meter-detail-header">{props.sitename}</div>
      <div className="meter-detail-body">
        <div className="meter-detail-body-row-1">
          <span
            onClick={() => {
              props.handleSetMeterDetailDisplay(false);
            }}
          >
            List
          </span>
          <span>{">"}</span>
          <span>Details</span>
        </div>
        <div className="meter-detail-body-row-2">
          <div>
            <div className="row-1">
              <div>{name}</div>
              <div></div>
              <div>Full Capacity</div>
            </div>
            <div className="row-2">
              <span>
                <span>Type:</span> Energy Meter
              </span>
              <span>
                <span>Attribute:</span> Main Meter
              </span>
            </div>
          </div>
          <div>
            <span>Direction:</span>
            <span>Direct Installed</span>
            <span></span>
            <span>Scale:</span>
            <span>1.0</span>
          </div>
        </div>
        <div className="meter-detail-body-row-3">
          <MeterDetailProductionStatistic meterid={props.meterid} />
          <MeterDetailProduction
            meterid={props.meterid}
            siteid={props.siteid}
          />
        </div>
        <div className="meter-detail-body-row-4">
          <MeterDetailData meterid={props.meterid} />
        </div>
      </div>
    </div>
  );
}
