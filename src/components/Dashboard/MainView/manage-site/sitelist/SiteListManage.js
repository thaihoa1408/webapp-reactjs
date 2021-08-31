import React, { useEffect, useState } from "react";
import "./SiteListManage.css";
import axios from "axios";
import * as RiIcons from "react-icons/ri";
import { getToken } from "../../../../Utils/Common";
import config from "../../../../../config.json";
export default function SiteListManage() {
  const searchFunction = () => {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  };

  //state use to save information of site that we edit (DONE)
  const [siteeditdisplay, setSiteeditdisplay] = useState(false);
  const [sitedit, setSiteedit] = useState({
    id: "",
    name: "",
    installdate: "",
    Capacity: "",

    accountId: [null],
    location: [null, null],
    siteOwner: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });
  const [gatewayinfor, setGatewayinfor] = useState([]);
  const handleSiteedit = (item) => {
    setSiteedit(item);
    axios
      .get(`/entityget?parent=${item.id}`)
      .then((response) => setGatewayinfor(response.data));
    setSiteeditdisplay(true);
    setActiondisplay([false, false, false, false]);
    setMappingdevice(false);
    setAddDeviceDisplay(false);
  };
  //

  const [status, setStatus] = useState([null, null]);
  const [actiondisplay, setActiondisplay] = useState([
    false,
    false,
    false,
    false,
  ]);

  //state and function use to add a gateway (DONE)
  const [namegateway, setNamegateway] = useState(null);
  const handleCreategateway = () => {
    if (namegateway === null) {
      setStatus([null, "you must fill gateway name!"]);
      return;
    }
    axios
      .post(`/entityadd`, {
        data: {
          kind: "Gateway",
          name: namegateway,
        },
        parent: sitedit.id,
      })
      .then((response) => {
        if (response.data.id) {
          axios
            .get(`/entityget?parent=${sitedit.id}`)
            .then((response) => setGatewayinfor(response.data));
          setStatus(["Create gateway successfully!", null]);
        }
      });
  };

  //state and function use to assign account (DONE)
  const [accountdisplay, setAccountdisplay] = useState(false);
  const [accountinfor, setAccountinfor] = useState([]);
  const [accountselect, setAccountselect] = useState([null, null]);
  const handleAssignaccount = () => {
    setStatus([null, null]);
    handleCancelDeleteGateway();
    setActiondisplay([false, true, false, false]);
    setMappingdevice(false);
    const token = getToken();
    if (!token) {
      return;
    }

    axios
      .get(`/get_user_infor?token=${token}`)
      .then((response) => setAccountinfor(response.data));
  };
  const handleAssignaccountaction = () => {
    if (accountselect[0] === null) {
      setStatus([null, "you must select account"]);
      return;
    }
    var token = getToken();
    axios
      .post(`/assign_site`, {
        token: token,
        userid: accountselect[1],
        siteid: sitedit.id,
      })
      .then((response) => {
        if (!response.data.already) {
          axios
            .post(`/entityupdate`, {
              id: sitedit.id,
              data: {
                accountId: [...sitedit.accountId, accountselect[0]],
              },
            })
            .then((response) => {
              axios
                .get(`/entityget?kind=Site`)
                .then((response) => setEntities(response.data));
              setSiteedit({
                ...sitedit,
                accountId: [...sitedit.accountId, accountselect[0]],
              });
            });
        }
        setStatus([response.data.message, null]);
      });
  };
  //delete gateway (DONE)
  const [deleteGateway, setDeleteGateway] = useState(false);
  const [gatewaySelect, setGatewaySelect] = useState([null, null]);
  const handleSetGatewaySelect = (item) => {
    setDeleteGateway(true);
    setGatewaySelect([item.name, item.id]);
  };
  const handleCancelDeleteGateway = () => {
    setDeleteGateway(false);
    setGatewaySelect([null, null]);
  };
  const handleDeleteGateway = () => {
    axios.get(`/entitydelete?id=${gatewaySelect[1]}`).then((response) => {
      setDeleteGateway(false);
      setGatewaySelect([null, null]);
      axios
        .get(`/entityget?parent=${sitedit.id}`)
        .then((response) => setGatewayinfor(response.data));
    });
    axios.get(`/entitydelete?parent=${gatewaySelect[1]}`);
  };
  // provision
  const handleProvision = (id) => {
    axios.get(`/provisionbegin?entity=${id}&timeout=180`).then();
  };

  // mapping device
  const [gatewayactive, setGatewayActive] = useState();
  const [mappingdevice, setMappingdevice] = useState(false);
  const [gatewayMappingInfor, setGatewayMappingInfor] = useState([null, null]);
  const handleSetdeivcemappinginfor = async (item) => {
    setGatewayActive(item);
    const [channel] = await Promise.all([
      axios
        .get(`/provisionretrieve?entity=${item.id}`)
        .then((response) => response.data),
    ]);

    setChannelInfor(channel);
    const device = await Promise.all(
      channel.map((item1, index1) =>
        axios
          .get(`/entityget?parent=${item.id}&device_id=${item1.device_id}`)
          .then((response) => response.data)
      )
    );
    let devicestatuscopy = [];
    device.map((item3) => {
      if (item3.length === 2) {
        devicestatuscopy.push(true);
      } else {
        devicestatuscopy.push(false);
      }
    });
    setDeviceStatus(devicestatuscopy);
    setMappingdevice(true);
    setGatewayMappingInfor([item.name, item.id]);
  };
  const [channelInfor, setChannelInfor] = useState([
    {
      device_name: "Inverter_1",
      device_id: "01",
      device_kind: "Inverter",
      device_channels: [
        {
          channel_name: "Channel_1",
          channel_id: "01",
          channel_type: "number",
        },
        {
          channel_name: "Channel_2",
          channel_id: "02",
          channel_type: "number",
        },
        {
          channel_name: "Channel_3",
          channel_id: "03",
          channel_type: "number",
        },
        {
          channel_name: "Channel_4",
          channel_id: "04",
          channel_type: "number",
        },
      ],
    },
    {
      device_name: "Inverter_2",
      device_id: "02",
      device_kind: "Inverter",
      device_channels: [
        {
          channel_name: "Channel_1",
          channel_id: "01",
          channel_type: "number",
        },
        {
          channel_name: "Channel_2",
          channel_id: "02",
          channel_type: "number",
        },
      ],
    },
  ]);
  const [datatype, setDatatype] = useState({});
  //add a device
  const [deviceStatus, setDeviceStatus] = useState([]);
  const [addDeviceDisplay, setAddDeviceDisplay] = useState(false);
  const [deviceSelect, setDeviceSelect] = useState({});
  const [deviceName, setDeviceName] = useState();
  const [kindDeviceDisplay, setKindDeviceDisplay] = useState(false);
  const [kindDeviceSelect, setKindDeviceSelect] = useState("Select");
  const autoMappingInverter = [
    "InverterOperationState",
    "InverterProduction",
    "InverterActivePower",
    "InverterReactivePower",
    "InverterInputPower",
    "InverterEfficiency",
    "InverterMainsFrequency",
    "InverterInternalTemperature",
    "InverterPowerFactor",
    "InverterRPhaseCurrent",
    "InverterSPhaseCurrent",
    "InverterTPhaseCurrent",
    "InverterRPhaseVoltage",
    "InverterSPhaseVoltage",
    "InverterTPhaseVoltage",
    "InverterLineVoltageL1L2",
    "InverterLineVoltageL2L3",
    "InverterLineVoltageL3L1",
    "InverterStringCurrent1",
    "InverterStringCurrent2",
    "InverterStringCurrent3",
    "InverterStringCurrent4",
    "InverterStringCurrent5",
    "InverterStringCurrent6",
    "InverterStringCurrent7",
    "InverterStringCurrent8",
    "InverterStringCurrent9",
    "InverterStringCurrent10",
  ];
  const autoMappingSiteMeter = [
    "SiteProduction",
    "SiteActivePower",
    "SiteIrradiation",
    "SiteIrradiance",
    "SiteOperationState",
  ];
  const autoMappingWeatherStation = [
    "Irradiation",
    "POA",
    "GHI",
    "AmbientTemperature",
    "ModuleTemperature",
    "WindSpeed",
    "WindDirection",
    "Humidity",
    "Rainfall",
  ];
  const autoMappingEnergyMeter = [
    "ActiveGeneratedEnergy",
    "ActiveConsumedEnergy",
    "ReactiveGeneratedEnergy",
    "ReactiveConsumedEnergy",
    "EnergyMeterProduction",
    "ActivePower",
    "ReactivePower",
  ];
  let mappingInforCopy = [];
  const [mappingInfor, setMappingInfor] = useState([]);
  const handleSetKindDevice = (item) => {
    setKindDeviceSelect(item);
    setKindDeviceDisplay(false);
    setMappingInfor([null]);
    if (item === "Inverter") {
      mappingInforCopy = [];
      deviceSelect.device_channels.map((item, index) => {
        if (autoMappingInverter[index] !== undefined) {
          mappingInforCopy.push(autoMappingInverter[index]);
        } else {
          mappingInforCopy.push(
            Object.values(Object.values(datatype)[0][0])[1]
          );
        }
      });
      setMappingInfor(mappingInforCopy);
    }
    if (item === "SiteMeter") {
      mappingInforCopy = [];
      deviceSelect.device_channels.map((item, index) => {
        if (autoMappingSiteMeter[index] !== undefined) {
          mappingInforCopy.push(autoMappingSiteMeter[index]);
        } else {
          mappingInforCopy.push(
            Object.values(Object.values(datatype)[0][0])[1]
          );
        }
      });
      setMappingInfor(mappingInforCopy);
    }
    if (item === "WeatherStation") {
      mappingInforCopy = [];
      deviceSelect.device_channels.map((item, index) => {
        if (autoMappingWeatherStation[index] !== undefined) {
          mappingInforCopy.push(autoMappingWeatherStation[index]);
        } else {
          mappingInforCopy.push(
            Object.values(Object.values(datatype)[0][0])[1]
          );
        }
      });
      setMappingInfor(mappingInforCopy);
    }
    if (item === "EnergyMeter") {
      mappingInforCopy = [];
      deviceSelect.device_channels.map((item, index) => {
        if (autoMappingEnergyMeter[index] !== undefined) {
          mappingInforCopy.push(autoMappingEnergyMeter[index]);
        } else {
          mappingInforCopy.push(
            Object.values(Object.values(datatype)[0][0])[1]
          );
        }
      });
      setMappingInfor(mappingInforCopy);
    }
  };
  const handleMapping = (item, index) => {
    mappingInforCopy = [...mappingInfor];
    mappingInforCopy[index] = item;
    setMappingInfor(mappingInforCopy);
  };
  const [capacityInverter, setCapacityInverter] = useState(null);
  const handleCreateDevice = () => {
    if (deviceName === "") {
      setStatus([null, "You must fill device name!"]);
      return;
    }
    if (kindDeviceSelect === "Select") {
      setStatus([null, "You must select kind device!"]);
      return;
    }
    if (kindDeviceSelect === "Inverter") {
      if (capacityInverter === null) {
        setStatus([null, "you must fill capacity"]);
        return;
      }
    }
    handleSetdeivcemappinginfor(gatewayactive);
    let link = {};
    mappingInfor.map((item, index) => {
      link[`${item}`] = {
        entity: deviceSelect.id,
        attr: deviceSelect.device_channels[index].channel_name,
      };
    });
    let data;
    if (kindDeviceSelect === "Inverter") {
      data = {
        kind: kindDeviceSelect,
        name: deviceName,
        Capacity: capacityInverter,
        ...metaData,
        device_id: deviceSelect.device_id,
      };
    } else {
      data = {
        kind: kindDeviceSelect,
        name: deviceName,
        ...metaData,
        device_id: deviceSelect.device_id,
      };
    }
    axios
      .post(`/entityadd`, {
        data: data,
        link: link,
        parent: gatewayMappingInfor[1],
      })
      .then((response) => {
        if (response.data.id) {
          setStatus(["Create device successfully!", null]);
          setCapacityInverter(null);
          setAddDeviceDisplay(false);
        }
      });
  };
  const [metaData, setMetaData] = useState({});
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [keyStatus, setKeyStatus] = useState(false);
  const [valueStatus, setValueStatus] = useState(false);
  const handAddMetaData = () => {
    if (key === "" && value === "") {
      setKeyStatus(true);
      setValueStatus(true);
      return;
    }
    if (key === "" && value !== "") {
      setKeyStatus(true);
      return;
    }
    if (key !== "" && value === "") {
      setValueStatus(true);
      return;
    }
    setMetaData({ ...metaData, [`${key}`]: value });
    setKey("");
    setValue("");
    document.getElementById("key").value = "";
    document.getElementById("value").value = "";
  };
  // device list
  const [gatewayOfDeviceListInfor, setGatewayOfDeviceListInfor] = useState([
    null,
    null,
  ]);
  const [deviceListDisplay, setDeviceListDisplay] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const handleSetDeviceInfor = async (item) => {
    const [devicelistget] = await Promise.all([
      axios
        .get(`/entityget?parent=${item.id}`)
        .then((response) => response.data),
    ]);
    let devicelistcopy = [];
    devicelistget.map((item) => {
      if (item.kind !== "Device") {
        devicelistcopy.push(item);
      }
    });
    setDeviceList(devicelistcopy);
    setGatewayOfDeviceListInfor([item.name, item.id]);
    setDeviceListDisplay(true);
  };
  //delete device
  const [deleteDeviceDisplay, setDeleteDeviceDisplay] = useState(false);
  const [deleteDeviceInfor, setdeleteDeviceInfor] = useState([null, null]);
  const handleSetDelete = (item) => {
    setdeleteDeviceInfor([item.name, item.id]);
    setDeleteDeviceDisplay(true);
  };
  const handleConfirmDeleteDevice = async () => {
    const [deletedevice] = await Promise.all([
      axios
        .get(`/entitydelete?id=${deleteDeviceInfor[1]}`)
        .then((response) => response.data),
    ]);
    const [devicelistget] = await Promise.all([
      axios
        .get(`/entityget?parent=${[gatewayOfDeviceListInfor[1]]}`)
        .then((response) => response.data),
    ]);
    let devicelistcopy = [];
    devicelistget.map((item) => {
      if (item.kind !== "Device") {
        devicelistcopy.push(item);
      }
    });
    setDeviceList(devicelistcopy);
    setDeleteDeviceDisplay(false);
  };
  //delete site
  const handleDeleteSite = () => {
    axios.get(`/entitydelete?id=${sitedit.id}`).then((response) => {
      if (response.data.ok) {
        axios
          .get(`/entityget?kind=Site`)
          .then((response) => setEntities(response.data));
        setActiondisplay([false, false, false, false]);
        setSiteeditdisplay(false);
      }
    });
    axios.get(`/entitydelete?ancestor=${sitedit.id}`).then((response) => {
      if (response.data.ok) {
        console.log("Children of this site have been removed");
      }
    });
    const token = getToken();
    axios
      .post(`/unassign_site`, {
        token: token,
        siteid: sitedit.id,
        account: sitedit.accountId,
      })
      .then((response) => {
        if (response.data.message === "done") {
          console.log("This site has been removed");
        }
      });
  };
  const handleCancelDeleteSite = () => {
    setActiondisplay([false, false, false, false]);
  };
  // get information all of site (DONE)
  const [entities, setEntities] = useState([]);
  let interval;
  const [provisionStatus, setProvisionStatus] = useState([]);
  useEffect(() => {
    axios
      .get(`/entityget?kind=Site`)
      .then((response) => setEntities(response.data));
    const token = getToken();
    axios
      .get(`/get_datatype_infor?token=${token}`)
      .then((response) => setDatatype(response.data));
    if (actiondisplay[2]) {
      interval = setInterval(async () => {
        let provisionstatuscopy = await Promise.all(
          gatewayinfor.map((item, index) =>
            axios
              .get(`/provisionstatus?entity=${item.id}`)
              .then((response) => response.data.status)
          )
        );
        setProvisionStatus(provisionstatuscopy);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [actiondisplay[2]]);
  return (
    <div>
      <div className="sitelist-search">
        <input
          type="text"
          id="myInput"
          onKeyUp={searchFunction}
          placeholder="Search for names.."
        />
        <div></div>
      </div>
      <div className="sitelist-table">
        <table id="myTable">
          <thead className="sitelist-table-header">
            <tr>
              <th>Name</th>
              <th>Capacity (kWp)</th>
              <th>Installation Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody class="sitelist-table-body">
            {entities.map((item, index) => {
              return (
                <tr>
                  <td>{item.name}</td>
                  <td>{item.Capacity}</td>
                  <td>{item.installdate}</td>
                  <td>
                    <span
                      onClick={() => {
                        handleSiteedit(item);
                      }}
                      className="edit-site"
                    >
                      Edit
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {siteeditdisplay && (
        <div className="sitelist-editor">
          <h3>Site Infor</h3>
          <div className="sitelist-editor-row-1">
            <div>
              <div>
                <h4>Site Details</h4>
                <ul>
                  <li>
                    Name: <span>{sitedit.name}</span>
                  </li>
                  <li>
                    Capacity: <span>{sitedit.Capacity}</span>
                  </li>
                  <li>
                    Installation date: <span>{sitedit.installdate}</span>
                  </li>
                  <li>
                    Account: <span>{sitedit.accountId}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4>Site Owner</h4>
                <ul>
                  <li>
                    First name: <span>{sitedit.siteOwner.firstName}</span>
                  </li>
                  <li>
                    Last name: <span>{sitedit.siteOwner.lastName}</span>
                  </li>
                  <li>
                    Phone: <span>{sitedit.siteOwner.phone}</span>
                  </li>
                  <li>
                    Email: <span>{sitedit.siteOwner.email}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="sitelist-editor-row-2">
            <div
              onClick={() => {
                setActiondisplay([true, false, false, false]);
                setStatus([null, null]);
                handleCancelDeleteGateway();
                setMappingdevice(false);
                setAddDeviceDisplay(false);
                setDeviceListDisplay(false);
              }}
            >
              Add Gateway
            </div>
            <div onClick={handleAssignaccount}>Assign Account</div>
            <div
              onClick={() => {
                setActiondisplay([false, false, true, false]);
                setStatus([null, null]);
                handleCancelDeleteGateway();
                setMappingdevice(false);
                setAddDeviceDisplay(false);
                setDeviceListDisplay(false);
              }}
            >
              Gateway Infor
            </div>
            <div
              onClick={() => {
                setActiondisplay([false, false, false, true]);
                setStatus([null, null]);
                handleCancelDeleteGateway();
                setMappingdevice(false);
                setAddDeviceDisplay(false);
                setDeviceListDisplay(false);
              }}
            >
              Delete
            </div>
            <div
              onClick={() => {
                setSiteeditdisplay(false);
                setActiondisplay([false, false, false, false]);
                setStatus([null, null]);
                setNamegateway(null);
                handleCancelDeleteGateway();
                setMappingdevice(false);
                setAddDeviceDisplay(false);
                setDeviceListDisplay(false);
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      )}
      <div className="sitelist-editor-action">
        {actiondisplay[0] && (
          <div className="sitelist-editor-action-addgateway">
            <div>
              <h3>
                Add a gateway <span>to {sitedit.name}</span>
              </h3>
            </div>
            <div>
              <div>Gateway name: </div>
              <input
                type="text"
                onChange={(e) => {
                  setNamegateway(e.target.value);
                  setStatus([null, null]);
                }}
              />
            </div>
            <div>
              <div onClick={handleCreategateway}>Create Gateway</div>
              <div
                onClick={() => {
                  setActiondisplay([false, false, false, false]);
                  setStatus([null, null]);
                  setNamegateway(null);
                }}
              >
                Cancel
              </div>
            </div>
            {status[0] && <div className="status-success">{status[0]}</div>}
            {status[1] && <div className="status-error">{status[1]}</div>}
          </div>
        )}
        {actiondisplay[1] && (
          <div className="sitelist-editor-action-assignaccount">
            <div>
              <h3>
                Assign account <span>to {sitedit.name}</span>
              </h3>
            </div>
            <div>
              <div>Associated to account:</div>
              <div>
                <div
                  className="account-link-infor"
                  onClick={() => {
                    setAccountdisplay(!accountdisplay);
                    setStatus([null, null]);
                  }}
                  tabIndex="0"
                  onBlur={() => setAccountdisplay(false)}
                >
                  <div>{accountselect[0]}</div>
                  <div>
                    <RiIcons.RiArrowDownSFill />
                  </div>
                </div>
                {accountdisplay && (
                  <div className="account-link-dropdown">
                    {accountinfor.map((item, index) => {
                      return (
                        <div
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setAccountselect([item.username, item.id]);
                            setAccountdisplay(false);
                          }}
                        >
                          {item.username}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div onClick={handleAssignaccountaction}>Assign</div>
              <div
                onClick={() => {
                  setActiondisplay([false, false, false, false]);
                  setStatus([null, null]);
                }}
              >
                Cancel
              </div>
            </div>
            {status[0] && <div className="status-success">{status[0]}</div>}
            {status[1] && <div className="status-error">{status[1]}</div>}
          </div>
        )}
        {actiondisplay[2] && (
          <div className="sitelist-editor-action-gatewayinfor">
            <div>
              <h3>
                Gateway infor <span>of {sitedit.name}</span>
              </h3>
            </div>
            <div className="gatewayinfor-table">
              <table>
                <thead className="gatewayinfor-table-header">
                  <tr>
                    <th>Name</th>
                    <th>Id</th>
                    <th>Kind</th>
                    <th>Provision</th>
                    <th className="gateway-action">Action</th>
                  </tr>
                </thead>
                <tbody class="gatewayinfor-table-body">
                  {gatewayinfor.map((item, index) => {
                    return (
                      <tr>
                        <td>{item.name}</td>
                        <td>{item.id}</td>
                        <td>{item.kind}</td>
                        <td>{provisionStatus[index]}</td>
                        <td className="gateway-action">
                          <button
                            onClick={() => {
                              handleProvision(item.id);
                              setMappingdevice(false);
                              setAddDeviceDisplay(false);
                              setDeviceListDisplay(false);
                              setDeleteGateway(false);
                            }}
                          >
                            Provision
                          </button>
                          <button
                            onClick={() => {
                              handleSetdeivcemappinginfor(item);
                              setDeviceListDisplay(false);
                              setDeleteGateway(false);
                              setAddDeviceDisplay(false);
                            }}
                          >
                            Mapping
                          </button>
                          <button
                            onClick={() => {
                              handleSetDeviceInfor(item);
                              setMappingdevice(false);
                              setAddDeviceDisplay(false);
                              setDeleteGateway(false);
                              setDeleteDeviceDisplay(false);
                            }}
                          >
                            Device
                          </button>
                          <button
                            disabled={deleteGateway}
                            onClick={() => {
                              handleSetGatewaySelect(item);
                              setMappingdevice(false);
                              setAddDeviceDisplay(false);
                              setDeviceListDisplay(false);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {deleteGateway && (
              <div className="gatewayinfor-delete">
                <div>Do you want to delete {gatewaySelect[0]}?</div>
                <div>
                  <button onClick={handleDeleteGateway}>Yes</button>
                  <button onClick={handleCancelDeleteGateway}>No</button>
                </div>
              </div>
            )}
          </div>
        )}
        {actiondisplay[3] && (
          <div className="sitelist-editor-action-delete">
            <h3>
              Do you want to delete this Site <span>({sitedit.name})?</span>
            </h3>
            <div>
              <div onClick={handleDeleteSite}>Yes</div>
              <div onClick={handleCancelDeleteSite}>No</div>
            </div>
          </div>
        )}
      </div>
      {mappingdevice && (
        <div className="gatewayinfor-provision-data">
          <div>
            <h3>
              Provision Data of <span>{gatewayMappingInfor[0]}</span>
            </h3>
          </div>
          <div className="gatewayinfor-provision-data-table">
            <table>
              <thead className="gatewayinfor-provision-data-table-header">
                <tr>
                  <th>Device Name</th>
                  <th>Device Id</th>
                  <th>Device Kind</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody class="gatewayinfor-provision-data-table-body">
                {channelInfor.map((item, index) => {
                  return (
                    <tr>
                      <td>{item.device_name}</td>
                      <td>{item.device_id}</td>
                      <td>{item.device_kind}</td>
                      <td>
                        <button
                          disabled={deviceStatus[index]}
                          onClick={() => {
                            setAddDeviceDisplay(true);
                            setDeviceSelect(item);
                            setDeviceName(item.device_name);
                            setKindDeviceSelect("Select");
                            setMappingInfor([]);
                            setStatus([null, null]);
                            setKeyStatus(false);
                            setValueStatus(false);
                            setMetaData({});
                          }}
                        >
                          Add Device
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {addDeviceDisplay && (
        <div className="gatewayinfor-add-device">
          <div>
            <h3>Add Device</h3>
          </div>
          <div>
            <div className="gatewayinfor-add-device-left">
              <div className="gatewayinfor-add-device-left-1">
                <div>Device Name: </div>
                <div>
                  <input
                    type="text"
                    placeholder={deviceSelect.device_name}
                    onChange={(e) => setDeviceName(e.target.value)}
                  />
                </div>
              </div>
              <div className="gatewayinfor-add-device-left-2">
                <div>kind: </div>
                <div>
                  <div
                    className="gatewayinfor-add-device-left-2-kind-infor"
                    onClick={() => {
                      setKindDeviceDisplay(!kindDeviceDisplay);
                    }}
                    tabIndex="0"
                    onBlur={() => setKindDeviceDisplay(false)}
                  >
                    <div>{kindDeviceSelect}</div>
                    <div>
                      <RiIcons.RiArrowDownSFill />
                    </div>
                  </div>
                  {kindDeviceDisplay && (
                    <div
                      className="gatewayinfor-add-device-left-2-kind-dropdown"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {Object.keys(datatype).map((item) => {
                        return (
                          <div onClick={() => handleSetKindDevice(item)}>
                            {item}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              {kindDeviceSelect === "Inverter" && (
                <div className="capacity-inverter">
                  <div>Capacity: </div>
                  <div>
                    <input
                      type="text"
                      onChange={(e) => setCapacityInverter(e.target.value)}
                    />
                  </div>
                  <div>kWh</div>
                </div>
              )}
              <div className="gatewayinfor-add-device-left-3">
                <div className="metadata">
                  {Object.entries(metaData).map((item, index) => {
                    return (
                      <div>
                        <div>{item[0]} :</div>
                        <div>{item[1]}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="add-metadata">
                  <div>
                    <input
                      className={
                        keyStatus
                          ? "add-metadata-status-false"
                          : "add-metadata-status"
                      }
                      id="key"
                      type="text"
                      placeholder="key"
                      onChange={(e) => {
                        setKey(e.target.value);

                        setKeyStatus(false);
                      }}
                    />
                  </div>
                  <div>
                    <input
                      className={
                        valueStatus
                          ? "add-metadata-status-false"
                          : "add-metadata-status"
                      }
                      id="value"
                      type="text"
                      placeholder="value"
                      onChange={(e) => {
                        setValue(e.target.value);
                        setValueStatus(false);
                      }}
                    />
                  </div>
                  <div onClick={handAddMetaData}>Ok</div>
                </div>
              </div>
              <div className="gatewayinfor-add-device-left-4">
                <div>Channels :</div>
                {deviceSelect.device_channels.map((item1, index1) => {
                  return (
                    <div>
                      <div>{item1.channel_name}:</div>
                      <select
                        onChange={(e) => {
                          handleMapping(e.target.value, index1);
                        }}
                      >
                        {Object.entries(datatype).map((item2, index2) => {
                          return (
                            <optgroup label={item2[0]}>
                              {item2[1].map((item3, index3) => {
                                if (mappingInfor[index1] === item3.value) {
                                  return (
                                    <option value={item3.value} selected={true}>
                                      {item3.name}
                                    </option>
                                  );
                                } else {
                                  return (
                                    <option
                                      value={item3.value}
                                      selected={false}
                                    >
                                      {item3.name}
                                    </option>
                                  );
                                }
                              })}
                            </optgroup>
                          );
                        })}
                      </select>
                    </div>
                  );
                })}
              </div>
              <div className="gatewayinfor-add-device-left-5">
                <button onClick={handleCreateDevice}>Create Device</button>
                <button
                  onClick={() => {
                    setAddDeviceDisplay(false);
                    setStatus([null, null]);
                    setKeyStatus(false);
                    setValueStatus(false);
                    setMetaData({});
                    setCapacityInverter(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="gatewayinfor-add-device-right">
              <div>
                <div>
                  <h4>Device Infor</h4>
                </div>
                <div>
                  <li>Device Name: </li>
                  <div>{deviceName}</div>
                </div>
                <div>
                  <li>Device Kind: </li>
                  <div>{kindDeviceSelect}</div>
                </div>
                {kindDeviceSelect === "Inverter" && (
                  <div>
                    <li>Capacity:</li>
                    <div>{capacityInverter} kWh</div>
                  </div>
                )}
                {Object.entries(metaData).map((item) => {
                  return (
                    <div>
                      <li>{item[0]}: </li>
                      <div>{item[1]}</div>
                    </div>
                  );
                })}
                <div>
                  <li>Alias: </li>
                </div>
                {deviceSelect.device_channels.map((item, index) => {
                  return (
                    <div>
                      <li className="gatewayinfor-add-device-right-alias">
                        {item.channel_name}:
                      </li>
                      <div>{mappingInfor[index]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {status[0] && <div className="status-success">{status[0]}</div>}
          {status[1] && <div className="status-error">{status[1]}</div>}
        </div>
      )}
      {deviceListDisplay && (
        <div className="gatewayinfor-devicelist">
          <div>
            <h3>
              Device List <span>of {gatewayOfDeviceListInfor[0]}</span>
            </h3>
          </div>
          <div className="gatewayinfor-provision-data-table">
            <table>
              <thead className="gatewayinfor-provision-data-table-header">
                <tr>
                  <th>Device Name</th>
                  <th>Device Id</th>
                  <th>Device Kind</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody class="gatewayinfor-provision-data-table-body">
                {deviceList.map((item, index) => {
                  return (
                    <tr>
                      <td>{item.name}</td>
                      <td>{item.device_id}</td>
                      <td>{item.kind}</td>
                      <td>
                        <button
                          onClick={() => {
                            handleSetDelete(item);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {deleteDeviceDisplay && (
            <div className="gatewayinfor-delete">
              <div>Do you want to delete {deleteDeviceInfor[0]}?</div>
              <div>
                <button onClick={handleConfirmDeleteDevice}>Yes</button>
                <button onClick={() => setDeleteDeviceDisplay(false)}>
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
