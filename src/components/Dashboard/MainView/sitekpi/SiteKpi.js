import React, { useEffect, useState } from "react";
import "./SiteKpi.css";
import WaveWidget from "./wagewidget/WaveWidget";
import * as RiIcons from "react-icons/ri";
import axios from "axios";
import { getUser, setSiteidSession } from "../../../Utils/Common";
import LineColumnChart from "./line-column-chart/LineColumnChart";
import SiteMetrics from "./site-metrics/SiteMetrics";
import LineChart from "./line-chart/LineChart";
import ProductionRatio from "./production-ratio/ProductionRatio";
import InverterYield from "./inverter-yield-ranking/InverterYield";
import InverterProduction from "./inverter-production-ranking/InverterProduction";
import TemperatureIrradiance from "./temperature-irradiance/TemperatureIrradiance";
import ActivePowerCapacity from "./activepower-capacity/ActivePowerCapacity";
import config from "../../../../config.json";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import LineColumnChart1 from "./line-column-chart/LineColumnChart1";
import LineChart1 from "./line-chart/LineChart1";
import LineColumnChart2 from "./line-column-chart/LineColumnChart2";
import LineChart2 from "./line-chart/LineChart2";
function SiteKpi(props) {
  const [sitedisplay, setSitedisplay] = useState(false);
  const [siteselect, setSiteselect] = useState([null, null]);
  const [capacity, setCapacity] = useState();
  let siteselectcopy = [null, null];
  //
  const [timeSelect, setTimeSelect] = useState("Day");
  const handleTimeSelect = (data) => {
    setTimeSelect(data);
  };
  const [entities, setEntities] = useState([]);
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
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
          setCapacity(response.data.Capacity);
        }
      });
    };
    fetchdata1();
  }, [id]);

  return (
    <div className="sitekpi">
      <div className="sitekpi-header">
        <div
          className="sitekpi-header-sitedisplay"
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
          <div className="sitekpi-header-sitedisplay-dropdown">
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
                    to={`/dashboard/site-monitor/sitekpi/${item.id}`}
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
      <div className="sitekpi-body">
        <div className="sitekpi-body-col-1">
          <div className="sitekpi-body-col-1-row-1">
            <TemperatureIrradiance
              sitename={siteselect[0]}
              siteid={siteselect[1]}
              date={formatDate(new Date())}
              handleTimeSelect={handleTimeSelect}
              timeSelect={timeSelect}
            />
            {timeSelect === "Day" && (
              <LineColumnChart
                siteid={siteselect[1]}
                date={formatDate(new Date())}
                timeselect={timeSelect}
              />
            )}
            {timeSelect === "Month" && (
              <LineColumnChart1
                siteid={siteselect[1]}
                date={formatDate(new Date())}
                timeselect={timeSelect}
                capacity={capacity}
              />
            )}
            {timeSelect === "Year" && (
              <LineColumnChart2
                siteid={siteselect[1]}
                date={formatDate(new Date())}
                timeselect={timeSelect}
                capacity={capacity}
              />
            )}
          </div>
          <div className="sitekpi-body-col-1-row-2">
            <ActivePowerCapacity
              siteid={siteselect[1]}
              date={formatDate(new Date())}
              capacity={capacity}
            />
            <WaveWidget
              siteid={siteselect[1]}
              date={formatDate(new Date())}
              timeselect={timeSelect}
              capacity={capacity}
            />
            <SiteMetrics
              siteid={siteselect[1]}
              date={formatDate(new Date())}
              timeselect={timeSelect}
              capacity={capacity}
            />
          </div>
          <div className="sitekpi-body-col-1-row-3">
            {timeSelect == "Day" && (
              <LineChart
                siteid={siteselect[1]}
                date={formatDate(new Date())}
                timeselect={timeSelect}
              />
            )}
            {timeSelect == "Month" && (
              <LineChart1
                siteid={siteselect[1]}
                date={formatDate(new Date())}
                timeselect={timeSelect}
                capacity={capacity}
              />
            )}
            {timeSelect === "Year" && (
              <LineChart2
                siteid={siteselect[1]}
                date={formatDate(new Date())}
                timeselect={timeSelect}
                capacity={capacity}
              />
            )}
            <ProductionRatio
              siteid={siteselect[1]}
              date={formatDate(new Date())}
              timeselect={timeSelect}
            />
          </div>
        </div>
        <div className="sitekpi-body-col-2">
          <div className="sitekpi-body-col-2-row-1">
            <InverterYield
              siteid={siteselect[1]}
              date={formatDate(new Date())}
              timeselect={timeSelect}
            />
          </div>
          <div className="sitekpi-body-col-2-row-2">
            <InverterProduction
              siteid={siteselect[1]}
              date={formatDate(new Date())}
              timeselect={timeSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteKpi;
