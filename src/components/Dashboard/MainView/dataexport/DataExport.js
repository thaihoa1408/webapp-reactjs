import React, { useEffect, useState } from "react";
import "./DataExport.css";
import * as RiIcons from "react-icons/ri";
import * as TiIcons from "react-icons/ti";
import { getToken, getUser, setSiteidSession } from "../../../Utils/Common";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as GoIcons from "react-icons/go";
import generatePDF from "./generatorPDF";
import config from "../../../../config.json";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
export default function DataExport(props) {
  const [sitedisplay, setSitedisplay] = useState(false);
  const [siteselect, setSiteselect] = useState([null, null]);
  //
  const [devicetype, setDevicetype] = useState([]);
  const [devicetypeSelect, setDevicetypeSelect] = useState("Select");
  const [devicetypeDisplay, setDevicetypeDisplay] = useState(false);
  const handleSetDeviceType = (item) => {
    setDevicetypeSelect(item);
    setDevicetypeDisplay(!devicetypeDisplay);
    setDeviceSelectDisplay("Select");
    setDeviceSelect([]);
    axios
      .get(`/entityget?ancestor=${siteselect[1]}&kind=${item}`)
      .then((response) => {
        setDevice(response.data);
      });
  };
  //
  const [device, setDevice] = useState([]);
  const [deviceSelect, setDeviceSelect] = useState([]);
  const [deviceSelectDisplay, setDeviceSelectDisplay] = useState("Select");
  const handleSetDeviceSelectDisplay = (item) => {
    let length = 0;
    let name = "";
    item.forEach((item) => {
      if (item !== undefined) {
        length = length + 1;
      }
    });
    if (length === 0) {
      setDeviceSelectDisplay("Select");
    } else {
      item.every((item) => {
        if (item !== undefined) {
          name = item.name;
          return false;
        }
        return true;
      });
      if (length === 1) {
        setDeviceSelectDisplay(name);
      } else {
        setDeviceSelectDisplay(name + " ...");
      }
    }
  };
  const [deviceDisplay, setDeviceDisplay] = useState(false);
  const handleSetDevice = (item, index) => {
    let deviceSelectvar = [...deviceSelect];
    if (deviceSelectvar[index] !== undefined) {
      deviceSelectvar[index] = undefined;
      console.log(deviceSelectvar);
      handleSetDeviceSelectDisplay(deviceSelectvar);
      setDeviceSelect(deviceSelectvar);
    } else {
      deviceSelectvar[index] = item;
      handleSetDeviceSelectDisplay(deviceSelectvar);
      setDeviceSelect(deviceSelectvar);
      console.log(deviceSelectvar);
    }
  };
  //
  const formatDate = (date) => {
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var date_format = yyyy + "-" + mm + "-" + dd;
    return date_format;
  };
  const [period, setPeriod] = useState(false);
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
  //
  const [intervalDisplay, setIntervalDisplay] = useState(false);
  const [intervalSelect, setIntervalSelect] = useState("minute");
  const [intervalSelectName, setIntervalSelectName] = useState("1min");
  const handleSetInterval = (value1, value2) => {
    setIntervalSelect(value1);
    setIntervalSelectName(value2);
  };
  //
  const [tick, setTick] = useState([false, false]);
  const handleSettick = (id) => {
    if (id === 0) {
      if (tick[0] == false) setTick([true, false]);
      else setTick([false, tick[1]]);
    } else {
      if (tick[1] == false) setTick([false, true]);
      else setTick([tick[0], false]);
    }
  };
  //
  const [error, setError] = useState(null);
  const [inforExport, setInforExport] = useState({
    devicetype: null,
    device: null,
    datestart: null,
    dateend: null,
    mode: null,
    interval: null,
  });
  const handleExport = async () => {
    if (devicetypeSelect === "Select") {
      setError("Please select device type!");
      return;
    }
    if (deviceSelectDisplay === "Select") {
      setError("Please select device!");
      return;
    }
    if (dateend < datestart) {
      setError("Please select period!");
      return;
    }
    if (tick[0] === false && tick[1] === false) {
      setError("Please select Export Mode!");
      return;
    }
    setError(null);
    let device = deviceSelect.filter((item) => item !== undefined);
    let devicetype = devicetypeSelect;
    let from = date1;
    let to = date2;
    let devicestr = "";
    device.map((item, index) => {
      devicestr = devicestr + item.name + ",";
    });
    let inteval = intervalSelect;
    let intervalName = intervalSelectName;
    setInforExport({
      devicetype: devicetypeSelect,
      device: devicestr,
      datestart: date1,
      dateend: date2,
      mode: tick[0] ? "CSV" : "PDF",
      interval: intervalName,
    });
    if (tick[0]) {
      handleExportDataCSV(devicetype, device, from, to, inteval);
    } else {
      handleExportDataPDF(devicetype, device, from, to, inteval);
    }
  };
  const [headerCSV, setHeaderCSV] = useState([]);
  const [dataCSV, setDataCSV] = useState([]);
  const [csv, setCSV] = useState(false);
  const handleExportDataCSV = async (
    devicetype,
    device,
    from,
    to,
    interval
  ) => {
    let date1 =
      from.split("-")[0] + "," + from.split("-")[1] + "," + from.split("-")[2];
    let date2 =
      to.split("-")[0] + "," + to.split("-")[1] + "," + to.split("-")[2];
    if (devicetype === "Inverter") {
      setHeaderCSV([
        { label: "Device", key: "device" },
        { label: "Inverter Production", key: "inverter_production" },
        { label: "Inveter Active Power", key: "inverter_active_power" },
        { label: "Time", key: "time" },
      ]);
      let url = [];
      device.map((item, index) => {
        if (item !== undefined) {
          url.push(
            axios
              .get(`/entitygetrecords`, {
                params: {
                  id: item.id,
                  attrs: "InverterProduction,InverterActivePower",
                  interval: interval,
                  filter: "first",
                  from: date1,
                  to: date2,
                },
              })
              .then((response) => response.data)
          );
        }
      });
      let dataItem = [];
      const rawdata = await Promise.all(url);
      device.map((item, index) => {
        for (let i = 0; i < rawdata[index].InverterProduction.length; i++) {
          dataItem.push({
            device: item.name,
            inverter_production: rawdata[index].InverterProduction[i].first.v,
            inverter_active_power:
              rawdata[index].InverterActivePower[i].first.v,
            time: rawdata[index].InverterProduction[i].first.t,
          });
        }
      });
      setDataCSV(dataItem);
      setCSV(true);
    }
    if (devicetype === "SiteMeter") {
      setHeaderCSV([
        { label: "Device", key: "device" },
        { label: "Site Production", key: "site_production" },
        { label: "Site Active Power", key: "site_active_power" },
        { label: "Time", key: "time" },
      ]);
      let url = [];
      device.map((item, index) => {
        if (item !== undefined) {
          url.push(
            axios
              .get(`/entitygetrecords`, {
                params: {
                  id: item.id,
                  attrs: "SiteProduction,SiteActivePower",
                  interval: interval,
                  filter: "first",
                  from: date1,
                  to: date2,
                },
              })
              .then((response) => response.data)
          );
        }
      });
      let dataItem = [];
      const rawdata = await Promise.all(url);
      device.map((item, index) => {
        for (let i = 0; i < rawdata[index].SiteProduction.length; i++) {
          dataItem.push({
            device: item.name,
            site_production: rawdata[index].SiteProduction[i].first.v,
            site_active_power: rawdata[index].SiteActivePower[i].first.v,
            time: rawdata[index].SiteProduction[i].first.t,
          });
        }
      });
      setDataCSV(dataItem);
      setCSV(true);
    }
    if (devicetype === "WeatherStation") {
      setHeaderCSV([
        { label: "Device", key: "device" },
        { label: "Ambient Temperature", key: "ambient_temp" },
        { label: "Module Temperature", key: "module_temp" },
        { label: "Humidity", key: "humidity" },
        { label: "Wind Speed", key: "wind_speed" },
        { label: "Wind Direction", key: "wind_direction" },
        { label: "Time", key: "time" },
      ]);
      let url = [];
      device.map((item, index) => {
        if (item !== undefined) {
          url.push(
            axios
              .get(`/entitygetrecords`, {
                params: {
                  id: item.id,
                  attrs:
                    "AmbientTemperature,ModuleTemperature,Humidity,WindSpeed,WindDirection",
                  interval: interval,
                  filter: "first",
                  from: date1,
                  to: date2,
                },
              })
              .then((response) => response.data)
          );
        }
      });
      const rawdata = await Promise.all(url);
      let dataItem = [];
      device.map((item, index) => {
        for (let i = 0; i < rawdata[index].AmbientTemperature.length; i++) {
          dataItem.push({
            device: item.name,
            ambient_temp: rawdata[index].AmbientTemperature[0].first.v,
            module_temp: rawdata[index].ModuleTemperature[0].first.v,
            humidity: rawdata[index].Humidity[0].first.v,
            wind_speed: rawdata[index].WindSpeed[0].first.v,
            wind_direction: rawdata[index].WindDirection[0].first.v,
            time: rawdata[index].AmbientTemperature[i].first.t,
          });
        }
      });
      setDataCSV(dataItem);
      setCSV(true);
    }
    if (devicetype === "EnergyMeter") {
      setHeaderCSV([
        { label: "Device", key: "device" },
        { label: "Active Generated Energy", key: "active_generated_energy" },
        { label: "Active Consumed Energy", key: "active_comsumed_energy" },
        {
          label: "Reactive Generated Energy",
          key: "reactive_generated_energy",
        },
        { label: "Reactive Consumed Energy", key: "reactive_comsumed_energy" },
        { label: "Time", key: "time" },
      ]);
      let url = [];
      device.map((item, index) => {
        if (item !== undefined) {
          url.push(
            axios
              .get(`/entitygetrecords`, {
                params: {
                  id: item.id,
                  attrs:
                    "ActiveGeneratedEnergy,ActiveConsumedEnergy,ReactiveGeneratedEnergy,ReactiveConsumedEnergy",
                  interval: interval,
                  filter: "first",
                  from: date1,
                  to: date2,
                },
              })
              .then((response) => response.data)
          );
        }
      });
      const rawdata = await Promise.all(url);
      let dataItem = [];
      device.map((item, index) => {
        for (let i = 0; i < rawdata[index].ActiveGeneratedEnergy.length; i++) {
          dataItem.push({
            device: item.name,
            active_generated_energy:
              rawdata[index].ActiveGeneratedEnergy[i].first.v,
            active_comsumed_energy:
              rawdata[index].ActiveConsumedEnergy[i].first.v,
            reactive_generated_energy:
              rawdata[index].ReactiveGeneratedEnergy[i].first.v,
            reactive_comsumed_energy:
              rawdata[index].ReactiveConsumedEnergy[i].first.v,
            time: rawdata[index].ActiveGeneratedEnergy[i].first.t,
          });
        }
      });
      setDataCSV(dataItem);
      setCSV(true);
    }
  };
  const handleExportDataPDF = async (
    devicetype,
    device,
    from,
    to,
    interval
  ) => {
    let date1 =
      from.split("-")[0] + "," + from.split("-")[1] + "," + from.split("-")[2];
    let date2 =
      to.split("-")[0] + "," + to.split("-")[1] + "," + to.split("-")[2];
    if (devicetype === "Inverter") {
      setDataColumn([
        "Id",
        "Device",
        "Inverter Production",
        "Inverter Active Power",
        "Time",
      ]);
      let url = [];
      device.map((item, index) => {
        if (item !== undefined) {
          url.push(
            axios
              .get(`/entitygetrecords`, {
                params: {
                  id: item.id,
                  attrs: "InverterProduction,InverterActivePower",
                  interval: interval,
                  filter: "first",
                  from: date1,
                  to: date2,
                },
              })
              .then((response) => response.data)
          );
        }
      });
      const rawdata = await Promise.all(url);
      let data = [];
      let dataItem = [];
      device.map((item, index) => {
        for (let i = 0; i < rawdata[index].InverterProduction.length; i++) {
          dataItem = [];
          dataItem.push(item.name);
          dataItem.push(rawdata[index].InverterProduction[i].first.v);
          dataItem.push(rawdata[index].InverterActivePower[i].first.v);
          dataItem.push(rawdata[index].InverterProduction[i].first.t);
          data.push(dataItem);
        }
      });
      setDataRow(data);
    }
    if (devicetype === "SiteMeter") {
      setDataColumn([
        "Id",
        "Device",
        "Site Production",
        "Site Active Power",
        "Time",
      ]);
      let url = [];
      device.map((item, index) => {
        if (item !== undefined) {
          url.push(
            axios
              .get(`/entitygetrecords`, {
                params: {
                  id: item.id,
                  attrs: "SiteProduction,SiteActivePower",
                  interval: interval,
                  filter: "first",
                  from: date1,
                  to: date2,
                },
              })
              .then((response) => response.data)
          );
        }
      });
      const rawdata = await Promise.all(url);
      let data = [];
      let dataItem = [];
      device.map((item, index) => {
        for (let i = 0; i < rawdata[index].SiteProduction.length; i++) {
          dataItem = [];
          dataItem.push(item.name);
          dataItem.push(rawdata[index].SiteProduction[i].first.v);
          dataItem.push(rawdata[index].SiteActivePower[i].first.v);
          dataItem.push(rawdata[index].SiteProduction[i].first.t);
          data.push(dataItem);
        }
      });
      console.log(data);
      setDataRow(data);
    }
    if (devicetype === "WeatherStation") {
      setDataColumn([
        "Id",
        "Device",
        "Ambient Temp",
        "Module Temp",
        "Humidity",
        "Wind Speed",
        "Wind Direction",
        "Time",
      ]);
      let url = [];
      device.map((item, index) => {
        if (item !== undefined) {
          url.push(
            axios
              .get(`/entitygetrecords`, {
                params: {
                  id: item.id,
                  attrs:
                    "AmbientTemperature,ModuleTemperature,Humidity,WindSpeed,WindDirection",
                  interval: interval,
                  filter: "first",
                  from: date1,
                  to: date2,
                },
              })
              .then((response) => response.data)
          );
        }
      });
      const rawdata = await Promise.all(url);
      let data = [];
      let dataItem = [];
      device.map((item, index) => {
        for (let i = 0; i < rawdata[index].AmbientTemperature.length; i++) {
          dataItem = [];
          dataItem.push(item.name);
          dataItem.push(rawdata[index].AmbientTemperature[i].first.v);
          dataItem.push(rawdata[index].ModuleTemperature[i].first.v);
          dataItem.push(rawdata[index].Humidity[i].first.v);
          dataItem.push(rawdata[index].WindSpeed[i].first.v);
          dataItem.push(rawdata[index].WindDirection[i].first.v);
          dataItem.push(rawdata[index].AmbientTemperature[i].first.t);
          data.push(dataItem);
        }
      });
      setDataRow(data);
    }
    if (devicetype === "EnergyMeter") {
      setDataColumn([
        "Id",
        "Device",
        "Active Generated Energy",
        "Active Consumed Energy",
        "Reactive Generated Energy",
        "Reactive Consumed Energy",
        "Time",
      ]);
      let url = [];
      device.map((item, index) => {
        if (item !== undefined) {
          url.push(
            axios
              .get(`/entitygetrecords`, {
                params: {
                  id: item.id,
                  attrs:
                    "ActiveGeneratedEnergy,ActiveConsumedEnergy,ReactiveGeneratedEnergy,ReactiveConsumedEnergy",
                  interval: interval,
                  filter: "first",
                  from: date1,
                  to: date2,
                },
              })
              .then((response) => response.data)
          );
        }
      });
      const rawdata = await Promise.all(url);
      let data = [];
      let dataItem = [];
      device.map((item, index) => {
        for (let i = 0; i < rawdata[index].ActiveGeneratedEnergy.length; i++) {
          dataItem = [];
          dataItem.push(item.name);
          dataItem.push(rawdata[index].ActiveGeneratedEnergy[i].first.v);
          dataItem.push(rawdata[index].ActiveConsumedEnergy[i].first.v);
          dataItem.push(rawdata[index].ReactiveGeneratedEnergy[i].first.v);
          dataItem.push(rawdata[index].ReactiveConsumedEnergy[i].first.v);
          dataItem.push(rawdata[index].ActiveGeneratedEnergy[i].first.t);
          data.push(dataItem);
        }
      });
      setDataRow(data);
    }
  };
  const handleDownload = () => {
    generatePDF(dataColumn, dataRow);
    setInforExport({
      devicetype: null,
      device: null,
      datestart: null,
      dateend: null,
      mode: null,
    });
    setDevicetypeSelect("Select");
    setDeviceSelect([]);
    setDeviceSelectDisplay("Select");
    setTick([false, false]);
  };
  const handleCancel = () => {
    setInforExport({
      devicetype: null,
      device: null,
      datestart: null,
      dateend: null,
      mode: null,
    });
    setDevicetypeSelect("Select");
    setDeviceSelect([]);
    setDeviceSelectDisplay("Select");
    setTick([false, false]);
    setCSV(false);
  };
  //
  const [dataColumn, setDataColumn] = useState([]);
  const [dataRow, setDataRow] = useState([]);
  const [entities, setEntities] = useState([]);
  let { id } = useParams();
  useEffect(() => {
    const getSiteInfor = async () => {
      var user = getUser();
      let entitiesget = await Promise.all(
        user.siteid.map((item, index) =>
          axios.get(`/entityget?id=${item}`).then((response) => response.data)
        )
      );
      setEntities(entitiesget);
      axios.get(`/entityget?id=${id}`).then((response) => {
        if (response.data) {
          setSiteselect([response.data.name, response.data.id]);
        }
      });
      const token = getToken();
      axios.get(`/get_datatype_infor?token=${token}`).then((response) => {
        setDevicetype(Object.keys(response.data));
      });
      setDevicetypeSelect("Select");
      setDeviceSelect([]);
      setDeviceSelectDisplay("Select");
      setTick([false, false]);
    };
    getSiteInfor();
  }, [id]);
  return (
    <div className="dataexport">
      <div className="dataexport-header">
        <div
          className="dataexport-header-sitedisplay"
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
          <div className="dataexport-header-sitedisplay-dropdown">
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
                    to={`/dashboard/data-report/dataexport/${item.id}`}
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
      <div className="dataexport-body">
        <div className="dataexport-body-row-1">
          <div>Device Type:</div>
          <div>
            <div
              className="device-type-infor"
              onClick={() => {
                setDevicetypeDisplay(!devicetypeDisplay);
                setDeviceDisplay(false);
              }}
              tabIndex="0"
              onBlur={() => setDevicetypeDisplay(false)}
            >
              <div>{devicetypeSelect}</div>
              <div>
                <RiIcons.RiArrowDownSFill />
              </div>
            </div>
            {devicetypeDisplay && (
              <div
                className="device-type-dropdown"
                onMouseDown={(e) => e.preventDefault()}
              >
                <ul>
                  <li
                    onClick={() => {
                      setDevicetypeSelect("Select");
                      setDevicetypeDisplay(!devicetypeDisplay);
                      setDeviceSelectDisplay("Select");
                      setDeviceSelect([]);
                    }}
                  >
                    Select
                  </li>
                  {devicetype.map((item, index) => {
                    return (
                      <li onClick={() => handleSetDeviceType(item)}>{item}</li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <div>Device: </div>
          <div>
            <div
              className="device-infor"
              onClick={() => {
                setDeviceDisplay(!deviceDisplay);
              }}
              tabIndex="0"
              onBlur={() => setDeviceDisplay(false)}
            >
              <div>{deviceSelectDisplay}</div>
              <div>
                <RiIcons.RiArrowDownSFill />
              </div>
            </div>
            {deviceDisplay && (
              <div
                className="device-dropdown"
                onMouseDown={(e) => e.preventDefault()}
              >
                <ul>
                  {device.map((item, index) => {
                    return (
                      <li
                        onClick={() => {
                          handleSetDevice(item, index);
                        }}
                      >
                        <div className="device-dropdown-tick">
                          {deviceSelect[index] !== undefined && (
                            <TiIcons.TiTick />
                          )}
                        </div>
                        <div>{item.name}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <div>Period: </div>
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
          <div>Interval:</div>
          <div>
            <div>
              <div
                className="interval-infor"
                onClick={() => {
                  setIntervalDisplay(!periodDisplay);
                }}
                tabIndex="0"
                onBlur={() => setIntervalDisplay(false)}
              >
                <div>{intervalSelectName}</div>
                <div>
                  <RiIcons.RiArrowDownSFill />
                </div>
              </div>
              {intervalDisplay && (
                <div
                  className="interval-dropdown"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div
                    onClick={() => {
                      handleSetInterval("minute", "1min");
                      setIntervalDisplay(false);
                    }}
                  >
                    1min
                  </div>
                  <div
                    onClick={() => {
                      handleSetInterval("15m", "15min");
                      setIntervalDisplay(false);
                    }}
                  >
                    15min
                  </div>
                  <div
                    onClick={() => {
                      handleSetInterval("30m", "30min");
                      setIntervalDisplay(false);
                    }}
                  >
                    30min
                  </div>
                  <div
                    onClick={() => {
                      handleSetInterval("hour", "1hour");
                      setIntervalDisplay(false);
                    }}
                  >
                    1hour
                  </div>
                  <div
                    onClick={() => {
                      handleSetInterval("day", "1day");
                      setIntervalDisplay(false);
                    }}
                  >
                    1day
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="dataexport-body-row-2">
          <div>Export Mode: </div>
          <div>
            <div className="export-mode" onClick={() => handleSettick(0)}>
              {tick[0] && <TiIcons.TiTick className="tick-icon" />}
            </div>
            <div>CSV File</div>
          </div>
          <div>
            <div className="export-mode" onClick={() => handleSettick(1)}>
              {tick[1] && <TiIcons.TiTick className="tick-icon" />}
            </div>
            <div>PDF File</div>
          </div>
        </div>
        <div className="dataexport-body-row-3">
          <button
            className={
              inforExport.devicetype !== null
                ? "button-invalid"
                : "button-export"
            }
            onClick={handleExport}
            disabled={inforExport.devicetype != null ? true : false}
          >
            {inforExport.devicetype !== null ? "Invalid" : "Export"}
          </button>
          {error && <div className="dataexport-error">{error}</div>}
        </div>
      </div>
      {inforExport.devicetype != null && (
        <div className="dataexport-infor">
          <div className="dataexport-infor-row-1">
            <div>
              <div>
                <TiIcons.TiTick />
              </div>
              <div>Success</div>
            </div>
            <ul>
              <li>Document</li>
              <li>Device Type: {inforExport.devicetype}</li>
              <li>Device: {inforExport.device}</li>
              <li>
                Period: from {inforExport.datestart} to {inforExport.dateend}
              </li>
              <li>Export Mode: {inforExport.mode}</li>
              <li>Interval: {inforExport.interval}</li>
            </ul>
          </div>
          <div className="dataexport-infor-row-2">
            {!csv && <button onClick={handleDownload}>Download</button>}
            {csv && (
              <button onClick={handleCancel}>
                <CSVLink
                  data={dataCSV}
                  headers={headerCSV}
                  className="csv-download"
                >
                  Download
                </CSVLink>
              </button>
            )}
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
