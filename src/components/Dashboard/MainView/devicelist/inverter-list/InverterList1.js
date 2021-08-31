import React, { useEffect, useState } from "react";
import "./InverterList1.css";
import * as RiIcons from "react-icons/ri";
import * as CgIcons from "react-icons/cg";
import axios from "axios";
import config from "../../../../../config.json";
export default function InverterList1(props) {
  const [data, setData] = useState([]);
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
  //
  const [rowsPerPageDisplay, setRowsPerPageDisplay] = useState(false);
  const handleSetRowsPerPage = (value) => {
    setRowsPerPageDisplay(false);
    setItemsPerPage(value);
    setCurrentPage(1);
  };
  //
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
  let url = [];
  const [inter, setInter] = useState(true);
  let interval;
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  const roundfunction = (value) => {
    if (value === null) {
      return null;
    } else {
      return Math.round(value * 100) / 100;
    }
  };
  let datevar = formatDate(new Date());
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  useEffect(() => {
    const getInverterData = () => {
      axios
        .get("/devicelist/inverterlist", {
          params: {
            siteid: props.siteid,
            date: year + "," + month + "," + day,
          },
        })
        .then((response) => setData(response.data));
    };
    getInverterData();
    if (inter) {
      interval = setInterval(() => {
        getInverterData();
      }, 5000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [props.siteid]);
  return (
    <div className="inverter-list">
      <div className="inverter-list-search">
        <input
          type="text"
          id="myInput"
          onKeyUp={searchFunction}
          placeholder="Search for names.."
        />
        <div></div>
      </div>
      <div className="table-container">
        <table id="myTable" className="table">
          <thead>
            <tr>
              <th scope="col">Inverter Name</th>
              <th scope="col">State</th>
              <th scope="col">Syst. Diag.</th>
              <th scope="col">
                <div
                  onClick={() => {
                    onSortChange("total_energy");
                  }}
                >
                  Total Energy
                  <CgIcons.CgArrowLongUp
                    className={
                      currentSort === "up" && sortField === "total_energy"
                        ? "sort-up active"
                        : "sort-up"
                    }
                  />
                  <CgIcons.CgArrowLongDown
                    className={
                      currentSort === "down" && sortField === "total_energy"
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
                  Active Power
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
                    onSortChange("input_power");
                  }}
                >
                  Input Power
                  <CgIcons.CgArrowLongUp
                    className={
                      currentSort === "up" && sortField === "input_power"
                        ? "sort-up active"
                        : "sort-up"
                    }
                  />
                  <CgIcons.CgArrowLongDown
                    className={
                      currentSort === "down" && sortField === "input_power"
                        ? "sort-down active"
                        : "sort-down"
                    }
                  />
                </div>
              </th>
              <th scope="col">
                <div
                  onClick={() => {
                    onSortChange("efficiency");
                  }}
                >
                  Efficiency
                  <CgIcons.CgArrowLongUp
                    className={
                      currentSort === "up" && sortField === "efficiency"
                        ? "sort-up active"
                        : "sort-up"
                    }
                  />
                  <CgIcons.CgArrowLongDown
                    className={
                      currentSort === "down" && sortField === "efficiency"
                        ? "sort-down active"
                        : "sort-down"
                    }
                  />
                </div>
              </th>
              <th scope="col">
                <div
                  onClick={() => {
                    onSortChange("internal_temp");
                  }}
                  efficiency
                >
                  Internal Temp
                  <CgIcons.CgArrowLongUp
                    className={
                      currentSort === "up" && sortField === "internal_temp"
                        ? "sort-up active"
                        : "sort-up"
                    }
                  />
                  <CgIcons.CgArrowLongDown
                    className={
                      currentSort === "down" && sortField === "internal_temp"
                        ? "sort-down active"
                        : "sort-down"
                    }
                  />
                </div>
              </th>
              <th scope="col">
                <div
                  onClick={() => {
                    onSortChange("production_today");
                  }}
                >
                  Production Today
                  <CgIcons.CgArrowLongUp
                    className={
                      currentSort === "up" && sortField === "production_today"
                        ? "sort-up active"
                        : "sort-up"
                    }
                  />
                  <CgIcons.CgArrowLongDown
                    className={
                      currentSort === "down" && sortField === "production_today"
                        ? "sort-down active"
                        : "sort-down"
                    }
                  />
                </div>
              </th>
              <th scope="col">
                <div
                  onClick={() => {
                    onSortChange("yield_today");
                  }}
                >
                  Yield Today
                  <CgIcons.CgArrowLongUp
                    className={
                      currentSort === "up" && sortField === "yield_today"
                        ? "sort-up active"
                        : "sort-up"
                    }
                  />
                  <CgIcons.CgArrowLongDown
                    className={
                      currentSort === "down" && sortField === "yield_today"
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
                  <tr
                    onClick={() => {
                      props.handleSetInverterDetailSelect(item.id);
                      props.handleSetInverterDetailDisplay(true);
                    }}
                  >
                    <td>{item.name}</td>
                    <td>{item.state}</td>
                    <td>{item.syst}</td>
                    <td>{item.total_energy}</td>
                    <td>{item.active_power}</td>
                    <td>{item.input_power}</td>
                    <td>{item.efficiency}</td>
                    <td>{item.internal_temp}</td>
                    <td>{item.production_today}</td>
                    <td>{item.yield_today}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="inverter-list-pagination">
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
  );
}
