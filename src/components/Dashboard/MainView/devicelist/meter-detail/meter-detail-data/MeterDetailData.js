import React, { useEffect, useState } from "react";
import "./MeterDetailData.css";
import axios from "axios";
import config from "../../../../../../config.json";
export default function MeterDetailData(props) {
  const [totalActiveGenerated, setTotalActiveGenerated] = useState();
  const [totalActiveConsumed, setTotalActiveConsumed] = useState();
  const [totalReactiveGenerated, setTotalReactiveGenerated] = useState();
  const [totalReactiveConsumed, setTotalReactiveConsumed] = useState();
  let data = [
    {
      meter_reading: "Combination",
      total: 0,
      sharp: 0,
      peak: 0,
      flat: 0,
      valley: 0,
    },
    {
      meter_reading: "Active Generated",
      total: totalActiveGenerated,
      sharp: 0,
      peak: 0,
      flat: 0,
      valley: 0,
    },
    {
      meter_reading: "Active Consumed",
      total: totalActiveConsumed,
      sharp: 0,
      peak: 0,
      flat: 0,
      valley: 0,
    },
    {
      meter_reading: "Reactive Generated",
      total: totalReactiveGenerated,
      sharp: 0,
      peak: 0,
      flat: 0,
      valley: 0,
    },
    {
      meter_reading: "Reactive Consumed",
      total: totalReactiveConsumed,
      sharp: 0,
      peak: 0,
      flat: 0,
      valley: 0,
    },
  ];
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
  const handleData = (data) => {
    if (
      data.ActiveGeneratedEnergy !== null &&
      data.ActiveGeneratedEnergy.length !== 0
    ) {
      setTotalActiveGenerated(
        roundfunction(data.ActiveGeneratedEnergy[0].last.v)
      );
    }
    if (
      data.ActiveConsumedEnergy !== null &&
      data.ActiveConsumedEnergy.length !== 0
    ) {
      setTotalActiveConsumed(
        roundfunction(data.ActiveConsumedEnergy[0].last.v)
      );
    }
    if (
      data.ReactiveGeneratedEnergy !== null &&
      data.ReactiveGeneratedEnergy.length !== 0
    ) {
      setTotalReactiveGenerated(
        roundfunction(data.ReactiveGeneratedEnergy[0].last.v)
      );
    }
    if (
      data.ReactiveConsumedEnergy !== null &&
      data.ReactiveConsumedEnergy.length !== 0
    ) {
      setTotalReactiveConsumed(
        roundfunction(data.ReactiveConsumedEnergy[0].last.v)
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
              attrs:
                "ActiveGeneratedEnergy,ActiveConsumedEnergy,ReactiveGeneratedEnergy,ReactiveConsumedEnergy",
              interval: "day",
              filter: "first,last",
              date: year + "," + month + "," + day,
            },
          })
          .then((response) => response.data),
      ]);
      handleData(firstResponse);
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
    <div className="meter-detail-data">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Meter Reading</th>
            <th scope="col">Total</th>
            <th scope="col">Sharp</th>
            <th scope="col">Peak</th>
            <th scope="col">Flat</th>
            <th scope="col">Valley</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr>
                <td>{item.meter_reading}</td>
                <td>{item.total}</td>
                <td>{item.sharp}</td>
                <td>{item.peak}</td>
                <td>{item.flat}</td>
                <td>{item.valley}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
