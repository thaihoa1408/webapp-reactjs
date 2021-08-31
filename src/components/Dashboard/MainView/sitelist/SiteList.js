import React, { useEffect, useState } from "react";
import SiteBox from "./sitebox/SiteBox";
import "./SiteList.css";
import axios from "axios";
import { getUser } from "../../../Utils/Common";
import { Redirect } from "react-router";
import config from "../../../../config.json";
import * as AiIcons from "react-icons/ai";
import * as CgIcons from "react-icons/cg";
import * as RiIcons from "react-icons/ri";
import { CSVLink } from "react-csv";
export default function SiteList(props) {
  const [entities, setEntities] = useState([]);
  const [select, setSelect] = useState("All");
  const [listdisplay, setListDisplay] = useState(false);
  const handleSetSelect = (value) => {
    setSelect(value);
    if (listdisplay) {
      document.getElementById("myInput").value = "";
      var table, tr, td, i, txtValue;
      table = document.getElementById("myTable");
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue === value || value === "All") {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  };

  const [data, setData] = useState([]);
  const [dataSelect, setDataSelect] = useState([]);
  // search function
  const searchFunction = () => {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

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
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageNumberLimit, setPageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };
  const pages = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pages.push(i);
  }
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          onClick={handleClick}
          className={currentPage == number ? "active" : null}
        >
          {number}
        </li>
      );
    } else {
      return null;
    }
  });
  const handleNextbtn = () => {
    setCurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };
  const handlePrevbtn = () => {
    setCurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit == 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };
  let pageIncrementBtn = null;
  if (pages.length > maxPageNumberLimit) {
    pageIncrementBtn = <li onClick={handleNextbtn}> &hellip; </li>;
  }

  let pageDecrementBtn = null;
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn = <li onClick={handlePrevbtn}> &hellip; </li>;
  }
  // rows per page
  const [rowsPerPageDisplay, setRowsPerPageDisplay] = useState(false);
  const handleSetRowsPerPage = (value) => {
    setRowsPerPageDisplay(false);
    setItemsPerPage(value);
    setCurrentPage(1);
  };
  // sort table
  const sortTypes = {
    up: {
      class: "sort-up",
      fn: (a, b) => a[sortField] - b[sortField],
    },
    down: {
      class: "sort-down",
      fn: (a, b) => b[sortField] - a[sortField],
    },
    default: {
      class: "sort",
      fn: (a, b) => a,
    },
  };
  const [sortField, setSortField] = useState(null);
  const [currentSort, setCurrentSort] = useState("default");
  const onSortChange = (item) => {
    setSortField(item);
    let nextSort;
    if (currentSort === "down") nextSort = "up";
    else if (currentSort === "up") nextSort = "default";
    else if (currentSort === "default") nextSort = "down";
    setCurrentSort(nextSort);
  };
  //
  const headers = [
    { label: "Name", key: "name" },
    { label: "Operation State", key: "operation_state" },
    { label: "Connection State", key: "connection_state" },
    { label: "Production Today", key: "production_today" },
    { label: "Active Power", key: "active_power" },
    { label: "Irradiance", key: "irradiance" },
    {
      label: "Production Budget Completion",
      key: "production_budget_completion",
    },
  ];
  let interval;
  const [inter, setInter] = useState(true);
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  let datevar = formatDate(new Date());
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  useEffect(() => {
    let user = getUser();
    const getData = () => {
      axios
        .get(`/sitelist`, {
          params: {
            siteids: user.siteid,
            date: year + "," + month + "," + day,
          },
        })
        .then((response) => setData(response.data));
    };
    getData();
    if (inter) {
      interval = setInterval(() => {
        getData();
      }, 5000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [inter]);
  return (
    <div className="sitelist">
      <div className="sitelist-header">Total Renewables</div>
      <div className="sitelist-state">
        <div
          className={select === "All" ? "active" : null}
          onClick={() => {
            handleSetSelect("All");
          }}
        >
          All {data.length}
        </div>
        <div
          className={select === "Manfunctioned" ? "active" : null}
          onClick={() => {
            handleSetSelect("Manfunctioned");
          }}
        >
          <div className="circle-1"></div>
          <div>Manfunctioned 0</div>
        </div>
        <div
          className={select === "Underperformed" ? "active" : null}
          onClick={() => {
            handleSetSelect("Underperformed");
          }}
        >
          <div className="circle-2"></div>
          <div>Underperformed 0</div>
        </div>
        <div
          className={select === "Normal" ? "active" : null}
          onClick={() => {
            handleSetSelect("Normal");
          }}
        >
          <div className="circle-3"></div>
          <div>Normal</div>
        </div>
        <div
          className={select === "Interrupted" ? "active" : null}
          onClick={() => {
            handleSetSelect("Interrupted");
          }}
        >
          <div className="circle-4"></div>
          <div>Connect Interrupted 0</div>
        </div>
        <div>
          <div
            className={!listdisplay ? "active" : null}
            onClick={() => setListDisplay(false)}
          >
            <AiIcons.AiFillAppstore />
          </div>
          <div
            className={listdisplay ? "active" : null}
            onClick={() => {
              setListDisplay(true);
              handleSetSelect("All");
            }}
          >
            <AiIcons.AiFillLayout />
          </div>
        </div>
      </div>
      {!listdisplay && (
        <div className="sitelist-body-item">
          {data.map((item, index) => {
            return (
              <div
                className={
                  item.operation_state !== select && select !== "All"
                    ? "sitelistbox"
                    : null
                }
              >
                <SiteBox
                  name={item.name}
                  operation_state={item.operation_state}
                  id={item.id}
                  capacity={item.capacity}
                  active_power={item.active_power}
                  irradiation={item.irradiation}
                  production_today={item.production_today}
                  power_ratio={item.power_ratio}
                  handleSetSiteid={props.handleSetSiteid}
                />
              </div>
            );
          })}
        </div>
      )}
      {listdisplay && (
        <div className="sitelist-body-list">
          <div className="sitelist-body-list-search">
            <input
              type="text"
              id="myInput"
              onKeyUp={searchFunction}
              placeholder="Search for names.."
            />
            <div></div>
            <CSVLink data={data} headers={headers} className="export">
              Export
            </CSVLink>
          </div>
          <div className="table-container">
            <table id="myTable" className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Operation State</th>
                  <th scope="col">Connection State</th>
                  <th scope="col">
                    <div
                      onClick={() => {
                        onSortChange("production_today");
                      }}
                    >
                      Production Today (kWh)
                      <CgIcons.CgArrowLongUp
                        className={
                          currentSort === "up" &&
                          sortField === "production_today"
                            ? "sort-up active"
                            : "sort-up"
                        }
                      />
                      <CgIcons.CgArrowLongDown
                        className={
                          currentSort === "down" &&
                          sortField === "production_today"
                            ? "sort-down active"
                            : "sort-down"
                        }
                      />
                    </div>
                  </th>
                  <th scope="col">
                    <div
                      onClick={() => {
                        onSortChange("active_power");
                      }}
                    >
                      Active Power (kW)
                      <CgIcons.CgArrowLongUp
                        className={
                          currentSort === "up" && sortField === "active_power"
                            ? "sort-up active"
                            : "sort-up"
                        }
                      />
                      <CgIcons.CgArrowLongDown
                        className={
                          currentSort === "down" && sortField === "active_power"
                            ? "sort-down active"
                            : "sort-down"
                        }
                      />
                    </div>
                  </th>
                  <th scope="col">
                    <div
                      onClick={() => {
                        onSortChange("irradiance");
                      }}
                    >
                      Irradiance (W/㎡)
                      <CgIcons.CgArrowLongUp
                        className={
                          currentSort === "up" && sortField === "irradiance"
                            ? "sort-up active"
                            : "sort-up"
                        }
                      />
                      <CgIcons.CgArrowLongDown
                        className={
                          currentSort === "down" && sortField === "irradiance"
                            ? "sort-down active"
                            : "sort-down"
                        }
                      />
                    </div>
                  </th>
                  <th scope="col">
                    <div
                      onClick={() => {
                        onSortChange("production_budget_completion");
                      }}
                    >
                      Irradiation (Wh/㎡)
                      <CgIcons.CgArrowLongUp
                        className={
                          currentSort === "up" && sortField === "irradiation"
                            ? "sort-up active"
                            : "sort-up"
                        }
                      />
                      <CgIcons.CgArrowLongDown
                        className={
                          currentSort === "down" && sortField === "irradiation"
                            ? "sort-down active"
                            : "sort-down"
                        }
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...currentItems]
                  .sort(sortTypes[currentSort].fn)
                  .map((item, index) => {
                    return (
                      <tr>
                        <td>{item.name}</td>
                        <td>{item.operation_state}</td>
                        <td>{item.connection_state}</td>
                        <td>{item.production_today}</td>
                        <td>{item.active_power}</td>
                        <td>{item.irradiance}</td>
                        <td>{item.irradiation}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="sitelist-pagination">
            <ul className="pageNumbers">
              <button
                onClick={handlePrevbtn}
                disabled={currentPage == pages[0] ? true : false}
              >
                Prev
              </button>

              {pageDecrementBtn}
              {renderPageNumbers}
              {pageIncrementBtn}

              <button
                onClick={handleNextbtn}
                disabled={currentPage == pages[pages.length - 1] ? true : false}
              >
                Next
              </button>
            </ul>
            <div className="rows-per-page">
              <div onClick={() => setRowsPerPageDisplay(!rowsPerPageDisplay)}>
                <div>{itemsPerPage}/Page</div>
                <div>
                  <RiIcons.RiArrowDownSFill />
                </div>
              </div>
              {rowsPerPageDisplay && (
                <div>
                  <div onClick={() => handleSetRowsPerPage(5)}>5/Page</div>
                  <div onClick={() => handleSetRowsPerPage(10)}>10/Page</div>
                  <div onClick={() => handleSetRowsPerPage(50)}>50/Page</div>
                  <div onClick={() => handleSetRowsPerPage(100)}>100/Page</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
