import React, { useEffect } from "react";
import { getUser } from "../../../Utils/Common";
import "./LeaderBoard.css";
import axios from "axios";
import config from "../../../../config.json";
import { useState } from "react";
import * as RiIcons from "react-icons/ri";
import ProductionBudget from "./production-budget/ProductionBudget";
import PerformanceRanking from "./performance-ranking/PerformanceRanking";
import * as AiIcons from "react-icons/ai";
export default function LeaderBoard() {
  const [entities, setEntities] = useState([]);
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [detailsDisplay, setDetailsDisplay] = useState(false);
  const handleSetDetailsDisplay = (value) => {
    setDetailsDisplay(value);
  };
  const [detailMonth, setDetailMonth] = useState([]);
  const handleSetDetailMonth = (item) => {
    setDetailMonth(item);
  };
  const [totalCompleteRate, setTotalCompleteRate] = useState(null);
  const handleSetTotalCompleteRate = (value) => {
    setTotalCompleteRate(value);
  };
  const [year, setYear] = useState(null);
  const handleSetYear = (value) => {
    setYear(value);
  };
  useEffect(() => {
    const fetchdata = async () => {
      var user = getUser();
      let entitiesget = await Promise.all(
        user.siteid.map((item, index) =>
          axios.get(`/entityget?id=${item}`).then((response) => response.data)
        )
      );
      setEntities(entitiesget);
    };
    fetchdata();
  }, []);
  return (
    <div className="leaderboard">
      <div className="leaderboard-header">Total Renewables</div>
      <div className="leaderboard-body">
        <div className="leaderboard-body-row-1">
          <ProductionBudget
            entities={entities}
            handleSetDetailsDisplay={handleSetDetailsDisplay}
            handleSetDetailMonth={handleSetDetailMonth}
            handleSetTotalCompleteRate={handleSetTotalCompleteRate}
            handleSetYear={handleSetYear}
          />
        </div>
        <div className="leaderboard-body-row-2">
          <PerformanceRanking entities={entities} />
        </div>
      </div>
      {detailsDisplay && (
        <div className="leaderboard-completion-rate">
          <div className="leadboard-completion-rate-container">
            <header>
              Yearly completion rate of all sites{" "}
              <span
                onClick={() => {
                  handleSetDetailsDisplay(false);
                }}
              >
                {" "}
                <AiIcons.AiOutlineClose />
              </span>
            </header>
            <section>
              <div>
                <span>Completion Rate in {year}</span>
                <span>{totalCompleteRate}%</span>
              </div>
              <div>
                {month.map((item, index) => {
                  return (
                    <div>
                      <div>{item}</div>
                      <div>{detailMonth[index]} %</div>
                    </div>
                  );
                })}
              </div>
            </section>
            <footer>
              <div
                onClick={() => {
                  handleSetDetailsDisplay(false);
                }}
              >
                OK
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
