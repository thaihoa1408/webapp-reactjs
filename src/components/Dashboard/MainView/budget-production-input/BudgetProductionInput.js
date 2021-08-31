import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUser, setSiteidSession } from "../../../Utils/Common";
import "./BudgetProductionInput.css";
import config from "../../../../config.json";
import axios from "axios";
import { Link } from "react-router-dom";
import * as RiIcons from "react-icons/ri";
import * as AiIcons from "react-icons/ai";
import * as GoIcons from "react-icons/go";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ProductionComparison from "./production-comparison/ProductionComparison";
import ProductionInput from "./production-input/ProductionInput";
export default function BudgetProductionInput(props) {
  const [sitedisplay, setSitedisplay] = useState(false);
  const [siteselect, setSiteselect] = useState([null, null, null]);
  const [entities, setEntities] = useState({});
  let { id } = useParams();
  //
  const [date, setDate] = useState(new Date());
  const [calendarDisplay, setCalendarDisplay] = useState(false);
  const handleSetDate = (date) => {
    setDate(date);
  };
  let yyyy = date.getFullYear();
  //
  const [addRecordDisplay, setAddRecordDisplay] = useState(false);
  const handleSetAddRecordDisplay = (value) => {
    setAddRecordDisplay(value);
  };
  //
  const [inputProduction, setInputProduction] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const handleSetInputProduction = (index, value) => {
    let inputproductioncopy = [...inputProduction];
    inputproductioncopy[index] = value;
    setInputProduction(inputproductioncopy);
  };
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  const handleConfirmAddRecord = () => {
    let user = getUser();
    let valuerecords = {
      year: yyyy,
      value: inputProduction,
      updatedby: user.username,
      updatedon: formatDate(new Date()),
    };
    let valuerecordscopy = [...siteselect[2], valuerecords];
    axios
      .post(`/entityupdate`, {
        id: siteselect[1],
        data: {
          productionBudget: valuerecordscopy,
        },
      })
      .then((response) => {
        console.log("updated");
        setAddRecordDisplay(false);
        axios.get(`/entityget?id=${id}`).then((response) => {
          if (response.data) {
            setSiteselect([
              response.data.name,
              response.data.id,
              response.data.productionBudget,
            ]);
          }
        });
      });
  };
  const [deleteRecordDisplay, setDeleteRecordsDisplay] = useState(false);
  const [recordSelectDelete, setRecordSelectDelete] = useState(null);
  const handleSetDeleteRecordDisplay = (value, index) => {
    setDeleteRecordsDisplay(value);
    setRecordSelectDelete(index);
  };
  const handleConfirmDeleteRecord = () => {
    let valuerecordscopy = [...siteselect[2]];
    valuerecordscopy.splice(recordSelectDelete, 1);
    axios
      .post(`/entityupdate`, {
        id: siteselect[1],
        data: {
          productionBudget: valuerecordscopy,
        },
      })
      .then((response) => {
        console.log("updated");
        setDeleteRecordsDisplay(false);
        axios.get(`/entityget?id=${id}`).then((response) => {
          if (response.data) {
            setSiteselect([
              response.data.name,
              response.data.id,
              response.data.productionBudget,
            ]);
          }
        });
      });
  };
  const [editRecordDisplay, setEditRecordDisplay] = useState(false);
  const [recordSelectEdit, setRecordSelectEdit] = useState();
  const [recordSelectEditIndex, setRecordSelectEditIndex] = useState();
  const handleSetEditRecordDisplay = (value, item, index) => {
    setRecordSelectEdit(item);
    setRecordSelectEditIndex(index);
    setInputProduction([
      item.jan,
      item.feb,
      item.mar,
      item.apr,
      item.may,
      item.jun,
      item.jul,
      item.aug,
      item.sep,
      item.oct,
      item.nov,
      item.dec,
    ]);
    setEditRecordDisplay(value);
  };
  const handleCancleEditRecord = () => {
    setEditRecordDisplay(false);
    setInputProduction([
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
  };
  const handleConfirmEditRecord = () => {
    let user = getUser();
    let valuerecordscopy = [...siteselect[2]];
    valuerecordscopy[recordSelectEditIndex] = {
      year: recordSelectEdit.year,
      value: inputProduction,
      updatedby: user.username,
      updatedon: formatDate(new Date()),
    };
    axios
      .post(`/entityupdate`, {
        id: siteselect[1],
        data: {
          productionBudget: valuerecordscopy,
        },
      })
      .then((response) => {
        console.log("updated");
        handleCancleEditRecord();
        axios.get(`/entityget?id=${id}`).then((response) => {
          if (response.data) {
            setSiteselect([
              response.data.name,
              response.data.id,
              response.data.productionBudget,
            ]);
          }
        });
      });
  };
  useEffect(() => {
    const fetchdata1 = async () => {
      var user = getUser();
      let entitiesget = await Promise.all(
        user.siteid.map((item, index) =>
          axios.get(`/entityget?id=${item}`).then((response) => response.data)
        )
      );
      setEntities(entitiesget);
      axios.get(`/entityget?id=${id}`).then((response) => {
        if (response.data) {
          setSiteselect([
            response.data.name,
            response.data.id,
            response.data.productionBudget,
          ]);
        }
      });
    };
    fetchdata1();
  }, [id]);
  return (
    <div className="budget-production-input">
      <div className="budget-production-input-header">
        <div
          className="budget-production-input-header-sitedisplay"
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
          <div className="budget-production-input-header-sitedisplay-dropdown">
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
                    to={`/dashboard/site-management/budgetproductioninput/${item.id}`}
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
      <div className="budget-production-input-body">
        <div className="budget-production-input-body-row-1">
          <ProductionComparison productionBudget={siteselect[2]} siteid={id} />
        </div>
        <div className="budget-production-input-body-row-2">
          <ProductionInput
            siteid={id}
            productionBudget={siteselect[2]}
            handleSetEditRecordDisplay={handleSetEditRecordDisplay}
            handleSetDeleteRecordDisplay={handleSetDeleteRecordDisplay}
            handleSetAddRecordDisplay={handleSetAddRecordDisplay}
          />
        </div>
      </div>
      {addRecordDisplay && (
        <div className="budget-production-input-add-record">
          <div className="container">
            <header>
              Add Record
              <span onClick={() => setAddRecordDisplay(false)}>
                <AiIcons.AiOutlineClose />
              </span>
            </header>
            <section>
              <div className="row-1">
                <div>Year</div>
                <div>
                  <div
                    onClick={() => {
                      setCalendarDisplay(!calendarDisplay);
                    }}
                    tabIndex="0"
                    onBlur={() => setCalendarDisplay(false)}
                  >
                    <span>{yyyy}</span>
                    <span>
                      <GoIcons.GoCalendar />
                    </span>
                  </div>
                  {calendarDisplay && (
                    <div onMouseDown={(e) => e.preventDefault()}>
                      <Calendar
                        onChange={handleSetDate}
                        defaultView="decade"
                        maxDetail="decade"
                        value={date}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="row-2">
                <div>
                  <div>Jan</div>
                  <input
                    type="text"
                    onChange={(e) => {
                      handleSetInputProduction(0, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Feb</div>
                  <input
                    type="text"
                    onChange={(e) => {
                      handleSetInputProduction(1, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Mar</div>
                  <input
                    type="text"
                    onChange={(e) => {
                      handleSetInputProduction(2, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Apr</div>
                  <input
                    type="text"
                    onChange={(e) => {
                      handleSetInputProduction(3, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>May</div>
                  <input
                    type="text"
                    onChange={(e) => {
                      handleSetInputProduction(4, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Jun</div>
                  <input
                    type="text"
                    onChange={(e) => {
                      handleSetInputProduction(5, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Jul</div>
                  <input
                    type="text"
                    onChange={(e) => {
                      handleSetInputProduction(6, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Aug</div>
                  <input
                    type="text"
                    onChange={(e) => {
                      handleSetInputProduction(7, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Sep</div>
                  <input
                    type="text"
                    onChange={(e) => {
                      handleSetInputProduction(8, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Oct</div>
                  <input
                    type="text"
                    onChange={(e) => {
                      handleSetInputProduction(9, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Nov</div>
                  <input
                    type="text"
                    onChange={(e) => {
                      handleSetInputProduction(10, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Dec</div>
                  <input
                    type="text"
                    onChange={(e) => {
                      handleSetInputProduction(11, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
              </div>
            </section>
            <footer>
              <div onClick={() => setAddRecordDisplay(false)}>Cancel</div>
              <div
                onClick={() => {
                  handleConfirmAddRecord();
                }}
              >
                OK
              </div>
            </footer>
          </div>
        </div>
      )}
      {editRecordDisplay && (
        <div className="budget-production-input-add-record">
          <div className="container">
            <header>
              Edit Record
              <span onClick={() => setAddRecordDisplay(false)}>
                <AiIcons.AiOutlineClose />
              </span>
            </header>
            <section>
              <div className="row-1">
                <div>Year</div>
                <div>
                  <div>
                    <span>{recordSelectEdit.year}</span>
                    <span>
                      <GoIcons.GoCalendar />
                    </span>
                  </div>
                </div>
              </div>
              <div className="row-2">
                <div>
                  <div>Jan</div>
                  <input
                    type="text"
                    value={inputProduction[0]}
                    onChange={(e) => {
                      handleSetInputProduction(0, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Feb</div>
                  <input
                    type="text"
                    value={inputProduction[1]}
                    onChange={(e) => {
                      handleSetInputProduction(1, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Mar</div>
                  <input
                    type="text"
                    value={inputProduction[2]}
                    onChange={(e) => {
                      handleSetInputProduction(2, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Apr</div>
                  <input
                    type="text"
                    value={inputProduction[3]}
                    onChange={(e) => {
                      handleSetInputProduction(3, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>May</div>
                  <input
                    type="text"
                    value={inputProduction[4]}
                    onChange={(e) => {
                      handleSetInputProduction(4, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Jun</div>
                  <input
                    type="text"
                    value={inputProduction[5]}
                    onChange={(e) => {
                      handleSetInputProduction(5, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Jul</div>
                  <input
                    type="text"
                    value={inputProduction[6]}
                    onChange={(e) => {
                      handleSetInputProduction(6, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Aug</div>
                  <input
                    type="text"
                    value={inputProduction[7]}
                    onChange={(e) => {
                      handleSetInputProduction(7, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Sep</div>
                  <input
                    type="text"
                    value={inputProduction[8]}
                    onChange={(e) => {
                      handleSetInputProduction(8, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Oct</div>
                  <input
                    type="text"
                    value={inputProduction[9]}
                    onChange={(e) => {
                      handleSetInputProduction(9, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Nov</div>
                  <input
                    type="text"
                    value={inputProduction[10]}
                    onChange={(e) => {
                      handleSetInputProduction(10, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
                <div>
                  <div>Dec</div>
                  <input
                    type="text"
                    value={inputProduction[11]}
                    onChange={(e) => {
                      handleSetInputProduction(11, e.target.value);
                    }}
                  />
                  <div>kWh</div>
                </div>
              </div>
            </section>
            <footer>
              <div onClick={handleCancleEditRecord}>Cancel</div>
              <div onClick={handleConfirmEditRecord}>OK</div>
            </footer>
          </div>
        </div>
      )}
      {deleteRecordDisplay && (
        <div className="budget-production-input-delete-record">
          <div className="budget-production-input-delete-record-container">
            <header>
              <span>Delete</span>
              <span onClick={() => setDeleteRecordsDisplay(false)}>
                <AiIcons.AiOutlineClose />
              </span>
            </header>
            <p>
              The records cannot be recovered after deletion. Really want to
              delete?
            </p>
            <div>
              <span onClick={() => setDeleteRecordsDisplay(false)}>Cancel</span>
              <span onClick={handleConfirmDeleteRecord}>Delete</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
