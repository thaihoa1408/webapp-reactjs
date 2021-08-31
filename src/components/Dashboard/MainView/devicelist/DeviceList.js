import React, { useEffect, useState } from "react";
import "./DeviceList.css";
import * as RiIcons from "react-icons/ri";
import { getUser, setSiteidSession } from "../../../Utils/Common";
import axios from "axios";
import config from "../../../../config.json";
import InverterList1 from "./inverter-list/InverterList1";
import MeterList from "./meter-list/MeterList";
import WeatherStationList from "./weatherstation-list/WeatherStationList";
import InverterDetail from "./inverter-detail/InverterDetail";
import MeterDetail from "./meter-detail/MeterDetail";
import WeatherStationDetail from "./weatherstation-detail/WeatherStationDetail";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
export default function DeviceList(props) {
  const [sitedisplay, setSitedisplay] = useState(false);
  const [siteselect, setSiteselect] = useState([null, null]);
  const [entities, setEntities] = useState([]);
  const [select, setSelect] = useState([true, false, false]);
  const handleSelect = (id) => {
    if (id === 0) {
      setSelect([true, false, false]);
    }
    if (id === 1) {
      setSelect([false, true, false]);
    }
    if (id === 2) {
      setSelect([false, false, true]);
    }
  };
  //
  const [inverterDetailDisplay, setInverterDetailDisplay] = useState(false);
  const handleSetInverterDetailDisplay = (value) => {
    setInverterDetailDisplay(value);
  };
  const [inverterDetailSelect, setInverterDetailSelect] = useState();
  const handleSetInverterDetailSelect = (value) => {
    setInverterDetailSelect(value);
  };
  //
  const [meterDetailDisplay, setMeterDetailDisplay] = useState(false);
  const handleSetMeterDetailDisplay = (value) => {
    setMeterDetailDisplay(value);
  };
  const [meterSelect, setMeterSelect] = useState();
  const handleSetMeterSelect = (value) => {
    setMeterSelect(value);
  };
  //
  const [weatherstationDetailDisplay, setWeatherstationDetailDisplay] =
    useState(false);
  const handleSetWeatherstationDetailDisplay = (value) => {
    setWeatherstationDetailDisplay(value);
  };
  const [weatherStationSelect, setWeatherStationSelect] = useState();
  const handleSetWeatherStationSelect = (value) => {
    setWeatherStationSelect(value);
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
        }
      });
    };
    fetchdata1();
  }, [id]);
  return (
    <>
      {!inverterDetailDisplay &&
        !meterDetailDisplay &&
        !weatherstationDetailDisplay && (
          <div className="devicelist">
            <div className="devicelist-header">
              <div
                className="devicelist-header-sitedisplay"
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
                <div className="devicelist-header-sitedisplay-dropdown">
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
                          to={`/dashboard/site-monitor/devicelist/${item.id}`}
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
            <div className="devicelist-body">
              <div className="devicelist-body-row-1">
                <div
                  className={
                    select[0]
                      ? "devicelist-body-row-1-kind active"
                      : "devicelist-body-row-1-kind"
                  }
                  onClick={() => handleSelect(0)}
                >
                  Inverter
                </div>
                <div
                  className={
                    select[1]
                      ? "devicelist-body-row-1-kind active"
                      : "devicelist-body-row-1-kind"
                  }
                  onClick={() => handleSelect(1)}
                >
                  Meter
                </div>
                <div
                  className={
                    select[2]
                      ? "devicelist-body-row-1-kind active"
                      : "devicelist-body-row-1-kind"
                  }
                  onClick={() => handleSelect(2)}
                >
                  Weather Station
                </div>
              </div>
              <div className="devicelist-body-row-2">
                {select[0] && (
                  <InverterList1
                    sitename={siteselect[0]}
                    siteid={siteselect[1]}
                    handleSetInverterDetailDisplay={
                      handleSetInverterDetailDisplay
                    }
                    handleSetInverterDetailSelect={
                      handleSetInverterDetailSelect
                    }
                  />
                )}
                {select[1] && (
                  <MeterList
                    sitename={siteselect[0]}
                    siteid={siteselect[1]}
                    handleSetMeterSelect={handleSetMeterSelect}
                    handleSetMeterDetailDisplay={handleSetMeterDetailDisplay}
                  />
                )}
                {select[2] && (
                  <WeatherStationList
                    sitename={siteselect[0]}
                    siteid={siteselect[1]}
                    handleSetWeatherStationSelect={
                      handleSetWeatherStationSelect
                    }
                    handleSetWeatherstationDetailDisplay={
                      handleSetWeatherstationDetailDisplay
                    }
                  />
                )}
              </div>
            </div>
          </div>
        )}
      {inverterDetailDisplay && (
        <InverterDetail
          sitename={siteselect[0]}
          siteid={siteselect[1]}
          inverterid={inverterDetailSelect}
          handleSetInverterDetailDisplay={handleSetInverterDetailDisplay}
        />
      )}
      {meterDetailDisplay && (
        <MeterDetail
          sitename={siteselect[0]}
          siteid={siteselect[1]}
          meterid={meterSelect}
          handleSetMeterDetailDisplay={handleSetMeterDetailDisplay}
        />
      )}
      {weatherstationDetailDisplay && (
        <WeatherStationDetail
          sitename={siteselect[0]}
          siteid={siteselect[1]}
          weatherstationid={weatherStationSelect}
          handleSetWeatherstationDetailDisplay={
            handleSetWeatherstationDetailDisplay
          }
        />
      )}
    </>
  );
}
