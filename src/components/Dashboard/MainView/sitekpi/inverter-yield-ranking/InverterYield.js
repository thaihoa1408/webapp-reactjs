import React, { useEffect, useState } from "react";
import "./InverterYield.css";
import * as CgIcons from "react-icons/cg";
import axios from "axios";
import config from "../../../../../config.json";
export default function InverterYield(props) {
  const [data, setData] = useState([
    {
      name: "inverter 1",
      InverterYield: 10,
      InverterProduction: 50,
      InverterPowerRatio: 70,
    },
    {
      name: "inverter 2",
      InverterYield: 5,
      InverterProduction: 45,
      InverterPowerRatio: 60,
    },
    {
      name: "inverter 3",
      InverterYield: 20,
      InverterProduction: 40,
      InverterPowerRatio: 50,
    },
  ]);
  const sortTypes = {
    up: {
      class: "sort-up",
      fn: (a, b) => a["InverterYield"] - b["InverterYield"],
    },
    down: {
      class: "sort-down",
      fn: (a, b) => b["InverterYield"] - a["InverterYield"],
    },
  };
  const [currentSort, setCurrentSort] = useState("up");
  const onSortChange = () => {
    let nextSort;
    if (currentSort === "down") nextSort = "up";
    else if (currentSort === "up") nextSort = "down";
    setCurrentSort(nextSort);
  };
  const [max, setMax] = useState(null);
  let interval;
  let url = [];
  let url1 = [];
  let url2 = [];
  const [inter, setInter] = useState(true);
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  let datevar = formatDate(new Date());
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  useEffect(() => {
    const getInvertData = () => {
      if (props.timeselect === "Day") {
        axios
          .get(`/siteview/invertertable`, {
            params: {
              siteid: props.siteid,
              time: "day",
              date: year + "," + month + "," + day,
            },
          })
          .then((response) => {
            let a = response.data;
            [...a]
              .sort((a, b) => b["InverterYield"] - a["InverterYield"])
              .forEach((item, index) => {
                if (index === 0) {
                  setMax(item.InverterYield);
                }
              });
            setData(a);
          });
      }
      if (props.timeselect === "Month") {
        axios
          .get(`/siteview/invertertable`, {
            params: {
              siteid: props.siteid,
              time: "month",
              date: year + "," + month,
            },
          })
          .then((response) => {
            let a = response.data;
            [...a]
              .sort((a, b) => b["InverterYield"] - a["InverterYield"])
              .forEach((item, index) => {
                if (index === 0) {
                  setMax(item.InverterYield);
                }
              });
            setData(a);
          });
      }
      if (props.timeselect === "Year") {
        axios
          .get(`/siteview/invertertable`, {
            params: {
              siteid: props.siteid,
              time: "year",
              date: year,
            },
          })
          .then((response) => {
            let a = response.data;
            [...a]
              .sort((a, b) => b["InverterYield"] - a["InverterYield"])
              .forEach((item, index) => {
                if (index === 0) {
                  setMax(item.InverterYield);
                }
              });
            setData(a);
          });
      }
    };
    getInvertData();
    if (inter) {
      interval = setInterval(() => {
        getInvertData();
      }, 5000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [props.siteid, inter, props.timeselect]);
  return (
    <div className="inverter-yield">
      <div className="inverter-yield-container">
        <div className="inverter-yield-header">
          <div>Inverter Yield Ranking</div>
          <div onClick={onSortChange}>
            <div>
              <CgIcons.CgArrowLongUp
                className={
                  currentSort === "up"
                    ? "inverter-yield-sort-up active"
                    : "inverter-yield-sort-up"
                }
              />
            </div>
            <div>
              <CgIcons.CgArrowLongDown
                className={
                  currentSort === "down"
                    ? "inverter-yield-sort-down active"
                    : "inverter-yield-sort-down"
                }
              />
            </div>
          </div>
        </div>
        <div className="inverter-yield-body">
          {[...data].sort(sortTypes[currentSort].fn).map((item, index) => {
            return (
              <div className="inverter-yield-body-row">
                <div>{item.name}</div>
                <div>
                  <div
                    style={{ width: `${(item.InverterYield * 100) / max}%` }}
                    className="inverter-yield-bar"
                  ></div>
                  <div>{item.InverterYield}h</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
