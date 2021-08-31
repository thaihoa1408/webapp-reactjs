import React, { useEffect, useState } from "react";
import "./MeterDetailProductionStatistic.css";
import axios from "axios";
import config from "../../../../../../config.json";
export default function MeterDetailProductionStatistic(props) {
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
  const [productionTotal, setProductionTotal] = useState();
  const [productionToday, setProductionToday] = useState();
  const [productionMonth, setProductionMonth] = useState();
  const [productionYear, setProductionYear] = useState();
  const handleData = (data1, data2, data3) => {
    if (
      data1.EnergyMeterProduction !== null &&
      data1.EnergyMeterProduction.length !== 0
    ) {
      setProductionTotal(roundfunction(data1.EnergyMeterProduction[0].last.v));
      setProductionToday(
        roundfunction(
          data1.EnergyMeterProduction[0].last.v -
            data1.EnergyMeterProduction[0].first.v
        )
      );
    }
    if (
      data2.EnergyMeterProduction !== null &&
      data2.EnergyMeterProduction.length !== 0
    ) {
      setProductionMonth(
        roundfunction(
          data2.EnergyMeterProduction[0].last.v -
            data2.EnergyMeterProduction[0].first.v
        )
      );
    }
    if (
      data3.EnergyMeterProduction !== null &&
      data3.EnergyMeterProduction.length !== 0
    ) {
      setProductionYear(
        roundfunction(
          data3.EnergyMeterProduction[0].last.v -
            data3.EnergyMeterProduction[0].first.v
        )
      );
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
          .get(`${config.SERVER_URL}/entitygetrecords`, {
            params: {
              id: props.meterid,
              attrs: "EnergyMeterProduction",
              interval: "day",
              filter: "first,last",
              date: year + "," + month + "," + day,
            },
          })
          .then((response) => response.data),
      ]);
      const [secondResponse] = await Promise.all([
        axios
          .get(`${config.SERVER_URL}/entitygetrecords`, {
            params: {
              id: props.meterid,
              attrs: "EnergyMeterProduction",
              interval: "month",
              filter: "first,last",
              date: year + "," + month,
            },
          })
          .then((response) => response.data),
      ]);
      const [thirdResponse] = await Promise.all([
        axios
          .get(`${config.SERVER_URL}/entitygetrecords`, {
            params: {
              id: props.meterid,
              attrs: "EnergyMeterProduction",
              interval: "year",
              filter: "first,last",
              date: year,
            },
          })
          .then((response) => response.data),
      ]);
      handleData(firstResponse, secondResponse, thirdResponse);
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
    <div className="meter-detail-production-statis">
      <header>Production Statistics</header>
      <section>
        <div>
          <span>Production Today:</span>
          <span>{productionToday} kWh</span>
        </div>
        <div>
          <span>Production MTD:</span>
          <span>{productionMonth} kWh</span>
        </div>
        <div>
          <span>Production YTD:</span>
          <span>{productionYear} kWh</span>
        </div>
        <div>
          <span>Production Total:</span>
          <span>{productionTotal} kWh</span>
        </div>
      </section>
    </div>
  );
}
