import React, { useEffect, useState } from "react";
import "./ActivePowerCapacity.css";
import axios from "axios";
import config from "../../../../../config.json";
export default function ActivePowerCapacity(props) {
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
  const [activePower, setActivePower] = useState();
  const handleData = (data) => {
    let sum = null;
    data.map((item) => {
      if (item.ActivePower !== null && item.ActivePower.length !== 0) {
        sum = sum + item.ActivePower[0].last.v;
      }
    });
    setActivePower(roundfunction(sum));
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
          .get(`/entityget?ancestor=${props.siteid}&kind=EnergyMeter`)
          .then((response) => response.data),
      ]);
      if (firstResponse.length === 0) {
        setInter(false);
      } else {
        setInter(true);
      }
      if (firstResponse.length) {
        let url = [];
        firstResponse.map((item, index) => {
          url.push(
            axios
              .get(`/entitygetrecords`, {
                params: {
                  id: item.id,
                  attrs: "EnergyMeterProduction,ActivePower",
                  interval: "day",
                  filter: "first,last",
                  date: year + "," + month + "," + day,
                },
              })
              .then((response) => response.data)
          );
        });
        const secondResponse = await Promise.all(url);
        handleData(secondResponse);
      } else {
        setActivePower(null);
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
    <div className="activepower-capacity">
      <div>
        <div>
          <div>Active Power</div>
          <div>{activePower} kW</div>
        </div>
        <div>
          <div>Capacity</div>
          <div>{props.capacity} MWp</div>
        </div>
      </div>
    </div>
  );
}
