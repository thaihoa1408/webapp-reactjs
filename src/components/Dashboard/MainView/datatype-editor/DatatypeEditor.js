import React, { useEffect, useState } from "react";
import { getToken } from "../../../Utils/Common";
import "./DatatypeEditor.css";
import * as TiIcons from "react-icons/ti";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import axios from "axios";
import config from "../../../../config.json";
export default function DatatypeEditor() {
  const [datatype, SetDatatype] = useState({});
  const [edit, setEdit] = useState(false);
  const [status, setStatus] = useState(null);
  const [nameItem, setNameItem] = useState("");
  const handleEdit = () => {
    setEdit(!edit);
    setStatus(null);
    let unitdisplaycopy = [];
    Object.keys(datatype).map((item) => {
      unitdisplaycopy.push(false);
    });
    setUnitDisplay(unitdisplaycopy);
    let unitselectcopy = [];
    Object.keys(datatype).map((item) => {
      unitselectcopy.push(null);
    });
    setUnitSelect(unitselectcopy);
  };
  const handleAdditem = (item, index) => {
    let arr = datatype[`${item}`];
    arr.push({
      name: nameItem,
      value: nameItem.split(" ").join(""),
      unit: unitSelect[index],
    });
    SetDatatype({ ...datatype, [`${item}`]: arr });
    let unitselectcopy = [...unitSelect];
    unitselectcopy[index] = null;
    setUnitSelect(unitselectcopy);
    document.getElementById(index).value = "";
  };

  const handleAddGroup = (event) => {
    if (event.key === "Enter") {
      if (event.target.value) {
        SetDatatype({ ...datatype, [`${event.target.value}`]: [] });
        let unitdisplaycopy = [...unitDisplay];
        unitdisplaycopy.push(false);
        setUnitDisplay(unitdisplaycopy);
        let unitselectcopy = [...unitSelect];
        unitselectcopy.push(null);
        setUnitSelect(unitselectcopy);
      }
      document.getElementById("addgroup").value = "";
    }
  };

  const handleDelteItem = (item, index) => {
    let arr = datatype[`${item}`];
    arr.splice(index, 1);
    SetDatatype({ ...datatype, [`${item}`]: arr });
  };

  const handleDeleteGroup = (item, index) => {
    let obj = {};
    obj = Object.assign(obj, datatype);
    delete obj[`${item}`];
    SetDatatype(obj);
    let unitdisplaycopy = [...unitDisplay];
    unitdisplaycopy.splice(index, 1);
    setUnitDisplay(unitdisplaycopy);
    let unitselectcopy = [...unitSelect];
    unitselectcopy.splice(index, 1);
    setUnitSelect(unitselectcopy);
  };
  const handleCancel = () => {
    const token = getToken();
    axios
      .get(`/get_datatype_infor?token=${token}`)
      .then((response) => SetDatatype(response.data));
    setEdit(false);
  };
  const handleApplyChange = () => {
    const token = getToken();
    axios
      .post(`/update_datatype`, {
        token: token,
        data: datatype,
      })
      .then((response) => {
        setStatus(response.data.message);
        axios
          .get(`/get_datatype_infor?token=${token}`)
          .then((response) => SetDatatype(response.data));
      });
    setEdit(false);
  };
  const units = [
    "No unit",
    "W",
    "kW",
    "kVar",
    "kWh",
    "W/㎡",
    "Wh/㎡",
    "kWh/㎡",
    "A",
    "V",
    "%",
    "m/s",
    "°C",
    "h",
    "mm",
    "°",
    "Hz",
  ];
  const [unitDisplay, setUnitDisplay] = useState([]);
  const [unitSelect, setUnitSelect] = useState([]);
  const handleSetUnitDisplay = (index) => {
    let unitdisplaycopy = [...unitDisplay];
    unitdisplaycopy[index] = !unitdisplaycopy[index];
    setUnitDisplay(unitdisplaycopy);
  };
  const handleSetUnitSelect = (unit, index) => {
    let unitselectcopy = [...unitSelect];
    unitselectcopy[index] = unit;
    setUnitSelect(unitselectcopy);
    let unitdisplaycopy = [...unitDisplay];
    unitdisplaycopy[index] = false;
    setUnitDisplay(unitdisplaycopy);
  };
  useEffect(() => {
    const token = getToken();
    axios
      .get(`/get_datatype_infor?token=${token}`)
      .then((response) => SetDatatype(response.data));
  }, []);
  return (
    <div className="datatype-editor">
      <div className="background-datatype-editor"></div>
      <div className="datatype-editor-body">
        <div className="datatype-editor-table">
          <div>
            <h2>Data Types</h2>
            <div onClick={handleEdit}>
              <AiIcons.AiTwotoneSetting />
            </div>
          </div>
          {Object.entries(datatype).map((item, index) => {
            return (
              <div>
                <div className="datatype-item">
                  <h3>{item[0]}</h3>
                  {edit && (
                    <div onClick={() => handleDeleteGroup(item[0], index)}>
                      <TiIcons.TiDeleteOutline />
                    </div>
                  )}
                </div>
                <div className="datatype-subitem">
                  <ul>
                    {item[1].map((item1, index1) => {
                      return (
                        <li>
                          <div>
                            <div>
                              {item1.name} ({item1.unit})
                            </div>
                            {edit && (
                              <div
                                onClick={() => handleDelteItem(item[0], index1)}
                              >
                                <TiIcons.TiDelete />
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  {edit && (
                    <div className="datatype-add-new-item">
                      <div>
                        <input
                          id={index}
                          type="text"
                          placeholder="Add Nem Item..."
                          onChange={(e) => setNameItem(e.target.value)}
                        />
                      </div>
                      <div>
                        <div>
                          <div>
                            {unitSelect[index] === null
                              ? "Select"
                              : unitSelect[index]}
                          </div>
                          <div onClick={() => handleSetUnitDisplay(index)}>
                            <RiIcons.RiArrowDownSFill />
                          </div>
                        </div>
                        {unitDisplay[index] && (
                          <div className="unit-dropdown">
                            {units.map((unit, uindex) => {
                              return (
                                <div
                                  onClick={() => {
                                    handleSetUnitSelect(unit, index);
                                  }}
                                >
                                  {unit}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div>
                        <div onClick={() => handleAdditem(item[0], index)}>
                          Submit
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {edit && (
            <input
              id="addgroup"
              type="text"
              placeholder="Add New Group..."
              onKeyDown={(e) => handleAddGroup(e)}
            />
          )}
          {edit && (
            <div className="datatype-editor-action">
              <div onClick={handleApplyChange}>Apply Change</div>
              <div onClick={handleCancel}>Cancel</div>
            </div>
          )}
          <div className="datatype-editor-status">{status}</div>
        </div>
      </div>
    </div>
  );
}
