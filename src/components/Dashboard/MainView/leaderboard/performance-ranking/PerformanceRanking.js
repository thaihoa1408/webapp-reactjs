import React, { useState } from "react";
import "./PerformanceRanking.css";
import * as GoIcons from "react-icons/go";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import PerformanceRankingChart from "./performance-ranking-chart/PerformanceRankingChart";
export default function PerformanceRanking(props) {
  const [measurement, setMeasurement] = useState("Yield");
  const [time, setTime] = useState("Day");
  const handleSetTime = (value) => {
    setTime(value);
    setCalendarDisplay(false);
    setDate(new Date());
  };
  // calendar
  const [date, setDate] = useState(new Date());
  const [calendarDisplay, setCalendarDisplay] = useState(false);
  const handleSetDate = (date) => {
    setDate(date);
  };
  let dd = String(date.getDate()).padStart(2, "0");
  let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = date.getFullYear();
  let dateformat = null;
  if (time === "Day") {
    dateformat = yyyy + "/" + mm + "/" + dd;
  } else if (time === "Month") dateformat = yyyy + "/" + mm;
  else dateformat = yyyy;
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  return (
    <div className="performance-ranking">
      <header>
        <div>Performance Ranking</div>
        <div className="measurements">
          <div
            className={measurement === "Yield" ? "active" : null}
            onClick={() => setMeasurement("Yield")}
          >
            Yield
          </div>
          <div
            className={measurement === "PR" ? "active" : null}
            onClick={() => setMeasurement("PR")}
          >
            PR
          </div>
        </div>
        <div className="time">
          <div
            className={time === "Day" ? "active" : null}
            onClick={() => handleSetTime("Day")}
          >
            Day
          </div>
          <div
            className={time === "Month" ? "active" : null}
            onClick={() => handleSetTime("Month")}
          >
            Month
          </div>
          <div
            className={time === "Year" ? "active" : null}
            onClick={() => handleSetTime("Year")}
          >
            Year
          </div>
        </div>
        <div className="calendar">
          <div
            onClick={() => {
              setCalendarDisplay(!calendarDisplay);
            }}
            tabIndex="0"
            onBlur={() => setCalendarDisplay(false)}
          >
            <div>{dateformat}</div>
            <div>
              <GoIcons.GoCalendar />
            </div>
          </div>
          {calendarDisplay && (
            <div onMouseDown={(e) => e.preventDefault()}>
              <Calendar
                onChange={handleSetDate}
                value={date}
                defaultView={
                  time === "Day"
                    ? "month"
                    : time === "Month"
                    ? "year"
                    : "decade"
                }
                maxDetail={
                  time === "Day"
                    ? "month"
                    : time === "Month"
                    ? "year"
                    : "decade"
                }
              />
            </div>
          )}
        </div>
      </header>
      <section>
        {measurement === "Yield" && (
          <PerformanceRankingChart
            measurement="Yield"
            entities={props.entities}
            date={formatDate(date)}
            timeselect={time}
          />
        )}
        {measurement === "PR" && (
          <PerformanceRankingChart
            measurement="PR"
            entities={props.entities}
            date={formatDate(date)}
            timeselect={time}
          />
        )}
      </section>
    </div>
  );
}
