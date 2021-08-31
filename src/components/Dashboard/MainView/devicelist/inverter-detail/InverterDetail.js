import React, { useEffect, useState } from "react";
import InverterDetailAidata from "./inverter-detail-aidata/InverterDetailAidata";
import InverterDetailDeviation from "./inverter-detail-deviation/InverterDetailDeviation";
import InverterDetailProduction from "./inverter-detail-production/InverterDetailProduction";
import "./InverterDetail.css";
import axios from "axios";
import config from "../../../../../config.json";
export default function InverterDetail(props) {
  const [inforSelect, setInforSelect] = useState([true, false, false]);
  const handleSetInforSelect = (id) => {
    if (id === 0) {
      setInforSelect([true, false, false]);
    }
    if (id === 1) {
      setInforSelect([false, true, false]);
    }
    if (id === 2) {
      setInforSelect([false, false, true]);
    }
  };
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  const [inverterName, setInverterName] = useState();
  const [inverterState, setInverterState] = useState();
  const [inverterCapacity, setInverterCapacity] = useState();
  const [data, setData] = useState({
    InverterEfficiency: null,
    InverterInternalTemperature: null,
    InverterInputPower: null,
    InverterActivePower: null,
    InverterReactivePower: null,
    InverterPowerFactor: null,
    InverterMainsFrequency: null,
    InverterRPhaseCurrent: null,
    InverterSPhaseCurrent: null,
    InverterTPhaseCurrent: null,
    InverterRPhaseVoltage: null,
    InverterSPhaseVoltage: null,
    InverterTPhaseVoltage: null,
    InverterProduction: null,
    InverterLineVoltageL1L2: null,
    InverterLineVoltageL2L3: null,
    InverterLineVoltageL3L1: null,
    InverterStringCurrent: [],
  });

  let interval;
  const [inter, setInter] = useState(true);
  let datevar = formatDate(new Date());
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  useEffect(() => {
    const getData = () => {
      axios.get(`/entityget?id=${props.inverterid}`).then((response) => {
        setInverterName(response.data.name);
        setInverterCapacity(response.data.Capacity);
      });
      axios
        .get("/devicelist/inverterdetailaidata", {
          params: {
            inverterid: props.inverterid,
            date: year + "," + month + "," + day,
          },
        })
        .then((response) => setData(response.data));
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
  }, [inter, props.inverterid]);
  return (
    <div className="inverter-detail">
      <div className="inverter-detail-header">{props.sitename}</div>
      <div className="inverter-detail-body">
        <div className="inverter-detail-body-row-1">
          <span
            onClick={() => {
              props.handleSetInverterDetailDisplay(false);
            }}
          >
            List
          </span>
          <span>{">"}</span>
          <span>Details</span>
        </div>
        <div className="inverter-detail-body-row-2">
          <div>
            <div className="row-1">
              <div>{inverterName}</div>
              <div></div>
              <div>Full Capacity</div>
            </div>
            <div className="row-2">
              <span>Manufacturer: --</span>
              <span>Model: --</span>
              <span>Serial Number: --</span>
            </div>
            <div className="row-3">
              <span>Comments: --</span>
            </div>
          </div>
          <div>
            <span>Capacity</span>
            <span>{inverterCapacity}kWp</span>
            <span></span>
            <span>Internal Temp</span>
            <span>{data.InverterInternalTemperature}℃</span>
            <span></span>
            <span>Efficiency</span>
            <span>{data.InverterEfficiency}%</span>
          </div>
        </div>
        <div className="inverter-detail-body-row-3">
          <div className="table-1">
            <header>
              <div
                className={inforSelect[0] ? "active" : null}
                onClick={() => handleSetInforSelect(0)}
              >
                General
              </div>
              <div
                className={inforSelect[1] ? "active" : null}
                onClick={() => handleSetInforSelect(1)}
              >
                DC
              </div>
              <div
                className={inforSelect[2] ? "active" : null}
                onClick={() => handleSetInforSelect(2)}
              >
                AC
              </div>
              <div></div>
            </header>
            {inforSelect[0] && (
              <section>
                <div>
                  <div>
                    <span>Input Power:</span>
                    {data.InverterInputPower} kW
                  </div>
                  <div>
                    <span></span>
                    <span>Apparent Power:</span>
                    --
                  </div>
                </div>
                <div>
                  <div>
                    <span>Active Power:</span>
                    {data.InverterActivePower} kW
                  </div>
                  <div>
                    <span></span>
                    <span>Grid Freq:</span>
                    {data.InverterMainsFrequency} Hz
                  </div>
                </div>
                <div>
                  <div>
                    <span>Reactive Power:</span>
                    {data.InverterReactivePower} kVar
                  </div>
                  <div>
                    <span></span>
                    <span>Power Factor:</span>
                    {data.InverterPowerFactor}
                  </div>
                </div>
              </section>
            )}
            {inforSelect[1] && (
              <section>
                <div>
                  <div>
                    <span></span>
                  </div>
                  <div>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div>
                  <div>
                    <span></span>
                  </div>
                  <div>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div>
                  <div>
                    <span></span>
                  </div>
                  <div>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </section>
            )}
            {inforSelect[2] && (
              <section>
                <div>
                  <div>
                    <span>Ua:</span>
                    {data.InverterRPhaseVoltage} V
                  </div>
                  <div>
                    <span></span>
                    <span>Ia:</span>
                    {data.InverterRPhaseCurrent} A
                  </div>
                </div>
                <div>
                  <div>
                    <span>Ub:</span>
                    {data.InverterSPhaseVoltage} V
                  </div>
                  <div>
                    <span></span>
                    <span>Ib:</span>
                    {data.InverterSPhaseCurrent} A
                  </div>
                </div>
                <div>
                  <div>
                    <span>Uc:</span>
                    {data.InverterTPhaseVoltage} V
                  </div>
                  <div>
                    <span></span>
                    <span>Ic:</span>
                    {data.InverterTPhaseCurrent} A
                  </div>
                </div>
              </section>
            )}
          </div>
          <div className="table-2">
            <header>
              <div>Alarm</div>
            </header>
            <section></section>
          </div>
        </div>
        <div className="inverter-detail-body-row-4">
          <InverterDetailProduction
            siteid={props.siteid}
            inverterid={props.inverterid}
          />
          <InverterDetailDeviation inverterid={props.inverterid} />
        </div>
        <div className="inverter-detail-body-row-5">
          <InverterDetailAidata inverterid={props.inverterid} />
        </div>
      </div>
    </div>
  );
}
