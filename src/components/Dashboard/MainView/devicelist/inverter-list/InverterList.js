import React, { useState } from "react";
import "./InverterList.css";
import * as CgIcons from "react-icons/cg";
export default function InverterList() {
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
  const [data, setData] = useState([
    {
      name: "inverter 1",
      yield: 10,
      production: 50,
      power_ratio: 70,
    },
    {
      name: "inverter 2",
      yield: 5,
      production: 45,
      power_ratio: 60,
    },
    {
      name: "inverter 3",
      yield: 20,
      production: 40,
      power_ratio: 65,
    },
    {
      name: "inverter 4",
      yield: 30,
      production: 60,
      power_ratio: 50,
    },
    {
      name: "inverter 5",
      yield: 25,
      production: 55,
      power_ratio: 80,
    },
  ]);
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
      <div>
        <div class="tbl-header">
          <table cellpadding="0" cellspacing="0" border="0">
            <thead>
              <tr>
                <th>Name</th>
                <th>
                  <button
                    onClick={() => {
                      onSortChange("yield");
                    }}
                  >
                    Yield
                    <CgIcons.CgArrowLongUp
                      className={
                        currentSort === "up" && sortField === "yield"
                          ? "sort-up active"
                          : "sort-up"
                      }
                    />
                    <CgIcons.CgArrowLongDown
                      className={
                        currentSort === "down" && sortField === "yield"
                          ? "sort-down active"
                          : "sort-down"
                      }
                    />
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => {
                      onSortChange("production");
                    }}
                  >
                    production (kWh)
                    <CgIcons.CgArrowLongUp
                      className={
                        currentSort === "up" && sortField === "production"
                          ? "sort-up active"
                          : "sort-up"
                      }
                    />
                    <CgIcons.CgArrowLongDown
                      className={
                        currentSort === "down" && sortField === "production"
                          ? "sort-down active"
                          : "sort-down"
                      }
                    />
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => {
                      onSortChange("power_ratio");
                    }}
                  >
                    Power Ratio (%)
                    <CgIcons.CgArrowLongUp
                      className={
                        currentSort === "up" && sortField === "power_ratio"
                          ? "sort-up active"
                          : "sort-up"
                      }
                    />
                    <CgIcons.CgArrowLongDown
                      className={
                        currentSort === "down" && sortField === "power_ratio"
                          ? "sort-down active"
                          : "sort-down"
                      }
                    />
                  </button>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="tbl-content">
          <table id="myTable" cellpadding="0" cellspacing="0" border="0">
            <tbody>
              {[...data].sort(sortTypes[currentSort].fn).map((item, index) => {
                return (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.yield}</td>
                    <td>{item.production}</td>
                    <td>{item.power_ratio}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
