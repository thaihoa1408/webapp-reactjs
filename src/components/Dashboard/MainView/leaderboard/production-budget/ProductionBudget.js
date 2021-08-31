import React, { useEffect, useState } from "react";
import "./ProductionBudget.css";
import * as GoIcons from "react-icons/go";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ReactApexChart from "react-apexcharts";
import ProductionBudgetChart from "./production-budget-chart/ProductionBudgetChart";
import axios from "axios";
import config from "../../../../../config.json";
import { getUser } from "../../../../Utils/Common";
export default function ProductionBudget(props) {
  const [date, setDate] = useState(new Date());
  const [calendarDisplay, setCalendarDisplay] = useState(false);
  const handleSetDate = (date) => {
    setDate(date);
  };
  let yyyy = date.getFullYear();
  //
  const [indexSiteSelect, setIndexSiteSelect] = useState(0);
  //
  const handleProduction = (data) => {
    let sum = null;
    data.map((item) => {
      item.EnergyMeterProduction.map((item1) => {
        sum = sum + item1.v;
      });
    });
    return sum;
  };
  const handleProductionMonth = (data) => {
    let a = [];
    for (let i = 0; i < 12; i++) {
      let sum = null;
      data.map((item) => {
        sum = sum + item.EnergyMeterProduction[i].v;
      });
      a.push(sum);
    }

    return a;
  };
  const roundfunction = (value) => {
    return Math.round(value * 100) / 100;
  };
  const [completetionRate, setCompletionRate] = useState([]);
  const [totalCompleteRate, setTotalCompleteRate] = useState(null);
  const [data, setData] = useState({
    completionrate: [],
    totalcompletionrate: null,
  });
  let interval;
  const [inter, setInter] = useState(true);
  useEffect(() => {
    const getData = async () => {
      let user = getUser();
      let [dataget] = await Promise.all([
        axios
          .get(`/leaderboard/production`, {
            params: {
              siteids: user.siteid,
              date: yyyy,
            },
          })
          .then((response) => response.data),
      ]);
      setData(dataget);
      props.handleSetTotalCompleteRate(dataget.totalcompletionrate);
      props.handleSetDetailMonth(dataget.totalcompleteratemonth);
      props.handleSetYear(yyyy);
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
  }, [date]);
  return (
    <div className="production-budget">
      <header>
        <div>Production Budget Completion Rate</div>
        <div className="calendar">
          <div
            onClick={() => {
              setCalendarDisplay(!calendarDisplay);
            }}
            tabIndex="0"
            onBlur={() => setCalendarDisplay(false)}
          >
            <div>{yyyy}</div>
            <div>
              <GoIcons.GoCalendar />
            </div>
          </div>
          {calendarDisplay && (
            <div onMouseDown={(e) => e.preventDefault()}>
              <Calendar
                onChange={handleSetDate}
                defaultView="decade"
                maxDetail="decade"
                value={date}
              />
            </div>
          )}
        </div>
      </header>
      <section className="production-budget-section">
        <div className="col-1">
          <div>
            <span>Total:</span>
            <span>{data.totalcompletionrate}%</span>
            <span
              onClick={() => {
                props.handleSetDetailsDisplay(true);
              }}
            >
              Details
            </span>
            <span>Completion Rate</span>
          </div>
          {props.entities.map((item, index) => {
            return (
              <div
                className="col-1-row"
                onClick={() => setIndexSiteSelect(index)}
                className={
                  indexSiteSelect === index ? "col-1-row active" : "col-1-row"
                }
              >
                <div>
                  {index + 1}. {item.name}
                </div>
                <div></div>
                <div></div>
                <div>{data.completionrate[index]}%</div>
              </div>
            );
          })}
        </div>
        <div className="col-2">
          {props.entities.map((item, index) => {
            if (indexSiteSelect === index) {
              return (
                <ProductionBudgetChart
                  sitename={item.name}
                  siteid={item.id}
                  date={yyyy}
                />
              );
            } else {
              return;
            }
          })}
        </div>
      </section>
    </div>
  );
}
