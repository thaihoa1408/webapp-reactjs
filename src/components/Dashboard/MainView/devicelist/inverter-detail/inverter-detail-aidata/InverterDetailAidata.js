import React, { useEffect, useState } from "react";
import "./InverterDetailAidata.css";
import axios from "axios";
import config from "../../../../../../config.json";
export default function InverterDetailAidata(props) {
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  let interval;
  const [inter, setInter] = useState(true);
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
  let table = [
    {
      name: "String Current",
      value: `[${data.InverterStringCurrent.toString()}]`,
      unit: "A",
    },
    {
      name: "DC Input Power",
      value: data.InverterInputPower,
      unit: "kW",
    },
    {
      name: "Active Power",
      value: data.InverterActivePower,
      unit: "kW",
    },
    {
      name: "Inverter Efficiency",
      value: data.InverterEfficiency,
      unit: "%",
    },
    {
      name: "Reactive Power",
      value: data.InverterReactivePower,
      unit: "kVar",
    },
    {
      name: "Power Factor",
      value: data.InverterPowerFactor,
      unit: "%",
    },
    {
      name: "Main Frequency",
      value: data.InverterMainsFrequency,
      unit: "Hz",
    },
    {
      name: "Internal Temperature",
      value: data.InverterInternalTemperature,
      unit: "°C",
    },
    {
      name: "R Phase Current",
      value: data.InverterRPhaseCurrent,
      unit: "A",
    },
    {
      name: "S Phase Current",
      value: data.InverterSPhaseCurrent,
      unit: "A",
    },
    {
      name: "T Phase Current",
      value: data.InverterTPhaseCurrent,
      unit: "A",
    },
    {
      name: "R Phase Voltage",
      value: data.InverterRPhaseVoltage,
      unit: "V",
    },
    {
      name: "S Phase Voltage",
      value: data.InverterSPhaseVoltage,
      unit: "V",
    },
    {
      name: "T Phase Voltage",
      value: data.InverterTPhaseVoltage,
      unit: "V",
    },
    {
      name: "Line Voltage L1-L2",
      value: data.InverterLineVoltageL1L2,
      unit: "V",
    },
    {
      name: "Line Voltage L2-L3",
      value: data.InverterLineVoltageL2L3,
      unit: "V",
    },
    {
      name: "Line Voltage L3-L1",
      value: data.InverterLineVoltageL3L1,
      unit: "V",
    },
    {
      name: "Daily Production",
      value: data.InverterProduction,
      unit: "kWh",
    },
  ];
  let datevar = formatDate(new Date());
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  useEffect(() => {
    const getData = () => {
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
  }, []);
  return (
    <div className="inverter-detail-aidata">
      <header>AI Data</header>
      <section>
        {table.map((item, index) => {
          return (
            <div>
              <span>{item.name}:</span>
              <span>{item.value}</span>
              <span>{item.unit}</span>
            </div>
          );
        })}
      </section>
    </div>
  );
}
