import React, { useEffect, useState } from "react";
import "./SiteView.css";
import * as RiIcons from "react-icons/ri";
import axios from "axios";
import { getUser, setSiteidSession } from "../../../Utils/Common";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import CalendarView from "./calendar/CalendarView";
import TableInverter from "./table-inverter/TableInverter";
import ProductionSiteInverter from "./production-site-inverter/ProductionSiteInverter";
import config from "../../../../config.json";
import OperationState from "./operation-state/OperationState";
import SiteviewChart from "./siteview-chart/SiteviewChart";
export default function SiteView(props) {
  const [sitedisplay, setSitedisplay] = useState(false);
  const [siteselect, setSiteselect] = useState([null, null, null]);
  //select view mode (day/month/year)
  const [select, setSelect] = useState([true, false, false, false]);
  const ChangeTime = (id) => {
    const arr = [false, false, false, false];
    for (let i = 0; i < 4; i++) {
      if (i === id) {
        arr[i] = true;
      } else arr[i] = false;
    }
    setSelect(arr);
  };
  //select date
  const [date, setDate] = useState(new Date());
  const handleSetdate = (date) => {
    setDate(date);
  };
  const [calendardisplay, setCalendardisplay] = useState(false);
  const handleSetcalendardisplay = (value) => {
    if (value === false) {
      setCalendardisplay(false);
    } else {
      setCalendardisplay(!calendardisplay);
    }
  };
  //
  const [inter, setInter] = useState(true);
  //
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  //
  const [entities, setEntities] = useState([]);
  let { id } = useParams();
  useEffect(() => {
    const fetchdata = async () => {
      axios.get(`/entityget?id=${id}`).then((response) => {
        if (response.data) {
          setSiteselect([
            response.data.name,
            response.data.id,
            response.data.Capacity,
          ]);
        }
      });
      var user = getUser();
      let entitiesget = await Promise.all(
        user.siteid.map((item, index) =>
          axios.get(`/entityget?id=${item}`).then((response) => response.data)
        )
      );
      setEntities(entitiesget);
    };
    fetchdata();
  }, [id]);
  //

  return (
    <div className="siteview">
      <div className="siteview-header">
        <div>
          <div
            className="siteview-header-sitedisplay"
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
            <div className="siteview-header-sitedisplay-dropdown">
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
                      to={`/dashboard/site-monitor/siteview/${item.id}`}
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
      </div>
      <div className="siteview-body">
        <div className="siteview-row">
          <OperationState siteid={id} />
        </div>
        <div className="siteview-row">
          <div className="button-select">
            <button
              className={select[0] ? "btn-bg" : "btn-bg-inactive"}
              onClick={() => {
                ChangeTime(0);
                setCalendardisplay(false);
                setDate(new Date());
              }}
            >
              Daily
            </button>
            <button
              className={select[1] ? "btn-bg" : "btn-bg-inactive"}
              onClick={() => {
                ChangeTime(1);
                setCalendardisplay(false);
                setDate(new Date());
              }}
            >
              Monthly
            </button>
            <button
              className={select[2] ? "btn-bg" : "btn-bg-inactive"}
              onClick={() => {
                ChangeTime(2);
                setCalendardisplay(false);
                setDate(new Date());
              }}
            >
              Yearly
            </button>
            <button
              className={select[3] ? "btn-bg" : "btn-bg-inactive"}
              onClick={() => {
                ChangeTime(3);
                setCalendardisplay(false);
                setDate(new Date());
              }}
            >
              Total
            </button>
            <div>
              <CalendarView
                handleSetdate={handleSetdate}
                date={date}
                calendardisplay={calendardisplay}
                handleSetcalendardisplay={handleSetcalendardisplay}
                select={select}
              />
            </div>
          </div>
        </div>
        <div className="siteview-row">
          <SiteviewChart
            select={select}
            capacity={siteselect[2]}
            siteid={id}
            date={formatDate(date)}
          />
        </div>
        <div className="siteview-row">
          <TableInverter siteid={id} date={formatDate(date)} select={select} />
          <ProductionSiteInverter
            siteid={id}
            date={formatDate(date)}
            select={select}
          />
        </div>
      </div>
    </div>
  );
  /*return (
    <div className="siteview">
      <div className="siteview-header">
        <div>Total Renewables</div>
        <div>
          <div
            className="siteview-header-sitedisplay"
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
            <div className="siteview-header-sitedisplay-dropdown">
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
                      to={`/dashboard/site-monitor/siteview/${item.id}`}
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
      </div>
      <div className="siteview-operation-state">
        <OperationState siteid={id} />
      </div>
      <div className="button-select">
        <button
          className={select[0] ? "btn-bg" : "btn-bg-inactive"}
          onClick={() => {
            ChangeTime(0);
            setCalendardisplay(false);
            setDate(new Date());
          }}
        >
          Daily
        </button>
        <button
          className={select[1] ? "btn-bg" : "btn-bg-inactive"}
          onClick={() => {
            ChangeTime(1);
            setCalendardisplay(false);
            setDate(new Date());
          }}
        >
          Monthly
        </button>
        <button
          className={select[2] ? "btn-bg" : "btn-bg-inactive"}
          onClick={() => {
            ChangeTime(2);
            setCalendardisplay(false);
            setDate(new Date());
          }}
        >
          Yearly
        </button>
        <button
          className={select[3] ? "btn-bg" : "btn-bg-inactive"}
          onClick={() => {
            ChangeTime(3);
            setCalendardisplay(false);
            setDate(new Date());
          }}
        >
          Total
        </button>
        <div>
          <CalendarView
            handleSetdate={handleSetdate}
            date={date}
            calendardisplay={calendardisplay}
            handleSetcalendardisplay={handleSetcalendardisplay}
            select={select}
          />
        </div>
      </div>
      <div className="row-siteview">
        <div className="row-siteview-header">
          <div>Capacity {siteselect[2]}MWp</div>
          <div>Irradiation {irradiation} kWh/㎡</div>
          <div>Yield {siteyield}h</div>
          <div>Production {production} MWh</div>
          <div>
            {select[0] ? "Power Ratio" : "PR"} {powerRatio}%
          </div>
        </div>
        <div className="row-siteview-body">
          {select[0] && (
            <LineColumnChart
              siteid={id}
              date={formatDate(date)}
              timeselect={select}
            />
          )}
          {select[1] && (
            <LineColumnChart1
              siteid={id}
              date={formatDate(date)}
              capacity={siteselect[2]}
            />
          )}
          {select[2] && (
            <LineColumnChart2
              siteid={id}
              date={formatDate(date)}
              capacity={siteselect[2]}
            />
          )}
          {select[0] && (
            <LineChart
              siteid={id}
              date={formatDate(date)}
              timeselect={select}
            />
          )}
          {select[1] && (
            <LineChart1
              siteid={id}
              date={formatDate(date)}
              capacity={siteselect[2]}
            />
          )}
          {select[2] && (
            <LineChart2
              siteid={id}
              date={formatDate(date)}
              capacity={siteselect[2]}
            />
          )}
        </div>
      </div>
      <div className="row-table">
        <TableInverter
          siteid={id}
          date={formatDate(date)}
          timeselect={select}
        />
        <ProductionSiteInverter
          siteid={id}
          date={formatDate(date)}
          timeselect={select}
        />
      </div>
    </div>
  );*/
}
