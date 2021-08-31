import React, { useState, useEffect } from "react";
import "./TableInverter.css";
import axios from "axios";
import * as CgIcons from "react-icons/cg";
import config from "../../../../../config.json";
function TableInverter(props) {
  const [data, setData] = useState([]);
  const sortTypes = {
    up: {
      class: "sort-up",
      fn: (a, b) => a[sortField] - b[sortField],
    },
    down: {
      class: "sort-down",
      fn: (a, b) => b[sortField] - a[sortField],
    },
    default: {
      class: "sort",
      fn: (a, b) => a,
    },
  };
  const [sortField, setSortField] = useState(null);
  const [currentSort, setCurrentSort] = useState("default");
  const onSortChange = (item) => {
    setSortField(item);
    let nextSort;
    if (currentSort === "down") nextSort = "up";
    else if (currentSort === "up") nextSort = "default";
    else if (currentSort === "default") nextSort = "down";
    setCurrentSort(nextSort);
  };
  let interval;
  const [inter, setInter] = useState(true);
  let year = props.date.split("-")[0];
  let month = props.date.split("-")[1];
  let day = props.date.split("-")[2];
  useEffect(() => {
    const getData = () => {
      if (props.select[0]) {
        axios
          .get(`/siteview/invertertable`, {
            params: {
              siteid: props.siteid,
              time: "day",
              date: year + "," + month + "," + day,
            },
          })
          .then((response) => setData(response.data));
      }
      if (props.select[1]) {
        axios
          .get(`/siteview/invertertable`, {
            params: {
              siteid: props.siteid,
              time: "month",
              date: year + "," + month,
            },
          })
          .then((response) => setData(response.data));
      }
      if (props.select[2]) {
        axios
          .get(`/siteview/invertertable`, {
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
  }, [props.siteid, props.date, props.select]);
  return (
    <div className="table-container">
      <h1 className="table-title">Inverter Ranking</h1>
      <table class="table-scroll">
        <thead>
          <tr>
            <th>Name</th>
            <th>
              <button
                onClick={() => {
                  onSortChange("InverterYield");
                }}
              >
                Yield
                <CgIcons.CgArrowLongUp
                  className={
                    currentSort === "up" && sortField === "InverterYield"
                      ? "sort-up active"
                      : "sort-up"
                  }
                />
                <CgIcons.CgArrowLongDown
                  className={
                    currentSort === "down" && sortField === "InverterYield"
                      ? "sort-down active"
                      : "sort-down"
                  }
                />
              </button>
            </th>
            <th>
              <button
                onClick={() => {
                  onSortChange("InverterProduction");
                }}
              >
                production (kWh)
                <CgIcons.CgArrowLongUp
                  className={
                    currentSort === "up" && sortField === "InverterProduction"
                      ? "sort-up active"
                      : "sort-up"
                  }
                />
                <CgIcons.CgArrowLongDown
                  className={
                    currentSort === "down" && sortField === "InverterProduction"
                      ? "sort-down active"
                      : "sort-down"
                  }
                />
              </button>
            </th>
            <th>
              <button
                onClick={() => {
                  onSortChange("InverterPowerRatio");
                }}
              >
                {props.select[0] ? "Power Ratio (%)" : "PR (%)"}
                <CgIcons.CgArrowLongUp
                  className={
                    currentSort === "up" && sortField === "InverterPowerRatio"
                      ? "sort-up active"
                      : "sort-up"
                  }
                />
                <CgIcons.CgArrowLongDown
                  className={
                    currentSort === "down" && sortField === "InverterPowerRatio"
                      ? "sort-down active"
                      : "sort-down"
                  }
                />
              </button>
            </th>
          </tr>
        </thead>
        <tbody class="body-half-screen">
          {[...data].sort(sortTypes[currentSort].fn).map((item, index) => {
            return (
              <tr>
                <td>{item.name}</td>
                <td>{item.InverterYield}</td>
                <td>{item.InverterProduction}</td>
                <td>{item.InverterPowerRatio}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TableInverter;
