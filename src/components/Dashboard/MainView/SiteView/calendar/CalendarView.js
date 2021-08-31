import React, { useState } from "react";
import Calendar from "react-calendar";
import "./CalendarView.css";
import "react-calendar/dist/Calendar.css";
import * as GoIcons from "react-icons/go";
export default function CalendarView(props) {
  var dd = String(props.date.getDate()).padStart(2, "0");
  var mm = String(props.date.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = props.date.getFullYear();
  var date = null;
  if (props.select[0]) {
    date = yyyy + "/" + mm + "/" + dd;
  } else if (props.select[1]) date = yyyy + "/" + mm;
  else date = yyyy;
  return (
    <div className="calendar-view">
      <div
        className="calendar-view-header"
        onClick={props.handleSetcalendardisplay}
        tabIndex="0"
        onBlur={() => props.handleSetcalendardisplay(false)}
      >
        <div>{date}</div>
        <div>
          <GoIcons.GoCalendar />
        </div>
      </div>
      <div
        className="calendar-view-body"
        onMouseDown={(e) => e.preventDefault()}
      >
        {props.calendardisplay && (
          <Calendar
            onChange={props.handleSetdate}
            value={props.date}
            defaultView={
              props.select[0] ? "month" : props.select[1] ? "year" : "decade"
            }
            maxDetail={
              props.select[0] ? "month" : props.select[1] ? "year" : "decade"
            }
          />
        )}
      </div>
    </div>
  );
}
