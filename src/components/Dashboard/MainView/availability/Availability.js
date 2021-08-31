import React, { useEffect } from "react";
import { useState } from "react";
import "./Availability.css";
import * as RiIcons from "react-icons/ri";
import * as GoIcons from "react-icons/go";
import * as AiIcons from "react-icons/ai";
import { getUser, setSiteidSession } from "../../../Utils/Common";
import axios from "axios";
import config from "../../../../config.json";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import StateStatistic from "./state-statistic/StateStatistic";
import StateChart from "./state-chart/StateChart";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
export default function Availability(props) {
  const [sitedisplay, setSitedisplay] = useState(false);
  const [siteselect, setSiteselect] = useState([null, null]);
  const [entities, setEntities] = useState([]);
  //
  const formatDate = (date) => {
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var date_format = yyyy + "-" + mm + "-" + dd;
    return date_format;
  };
  const [datestart, setDatestart] = useState(new Date());
  const handleSetdatestart = (date) => {
    setDatestart(date);
  };
  var date1 = formatDate(datestart);
  const [dateend, setDateend] = useState(new Date());
  const handleSetdateend = (date) => {
    setDateend(date);
  };
  var date2 = formatDate(dateend);
  const [periodDisplay, setPeriodDisplay] = useState(false);
  let { id } = useParams();
  useEffect(() => {
    const fetchdata1 = async () => {
      var user = getUser();
      let entitiesget = await Promise.all(
        user.siteid.map((item, index) =>
          axios
            .get(`${config.SERVER_URL}/entityget?id=${item}`)
            .then((response) => response.data)
        )
      );
      setEntities(entitiesget);
      axios.get(`${config.SERVER_URL}/entityget?id=${id}`).then((response) => {
        if (response.data) {
          setSiteselect([response.data.name, response.data.id]);
        }
      });
    };
    fetchdata1();
  }, [id]);
  return (
    <div className="availability">
      <div className="availability-header">
        <div
          className="availability-header-sitedisplay"
          onClick={() => setSitedisplay(!sitedisplay)}
          tabIndex="0"
          onBlur={() => setSitedisplay(false)}
        >
          <div>{siteselect[0]}</div>
          <div>
            <RiIcons.RiArrowDownSFill />
          </div>
        </div>
        {sitedisplay && (
          <div className="availability-header-sitedisplay-dropdown">
            {entities.map((item, index) => {
              return (
                <div
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSitedisplay(false);
                    setSiteidSession(item.id);
                    props.handleSetSiteid(item.id);
                  }}
                >
                  <Link
                    to={`/dashboard/analyse/availability/${item.id}`}
                    className="sitedisplay-dropdown-item"
                  >
                    <div>{item.name}</div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="availability-body">
        <div className="availability-body-row-1">
          <div>
            <div
              className="period-infor"
              onClick={() => {
                setPeriodDisplay(!periodDisplay);
              }}
              tabIndex="0"
              onBlur={() => setPeriodDisplay(false)}
            >
              <div>{date1}</div>
              <div>-</div>
              <div>{date2}</div>
              <div>
                <GoIcons.GoCalendar />
              </div>
            </div>
            {periodDisplay && (
              <div
                className="period-dropdown"
                onMouseDown={(e) => e.preventDefault()}
              >
                <Calendar
                  onChange={handleSetdatestart}
                  value={datestart}
                  handleCancel
                  maxDate={new Date()}
                />
                <Calendar
                  onChange={handleSetdateend}
                  value={dateend}
                  maxDate={new Date()}
                />
              </div>
            )}
          </div>
          <div>Apply</div>
          <div>Reset</div>
        </div>
        <div className="availability-body-row-2">
          <StateStatistic />
        </div>
        <div className="availability-body-row-3">
          <StateChart />
        </div>
      </div>
    </div>
  );
}
