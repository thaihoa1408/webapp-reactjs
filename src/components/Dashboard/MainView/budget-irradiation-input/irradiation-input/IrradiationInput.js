import React, { useEffect, useState } from "react";
import "./IrradiationInput.css";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import { CSVLink } from "react-csv";
import axios from "axios";
import config from "../../../../../config.json";
export default function IrradiationInput(props) {
  const [data, setData] = useState([
    {
      year: "2021",
      jan: 134020,
      feb: 156280,
      mar: 178880,
      apr: 156350,
      may: 150650,
      jun: 133720,
      jul: 140210,
      aug: 144140,
      sep: 128950,
      oct: 138430,
      nov: 128810,
      dec: 133840,
      updated_by: "phamthai",
      updated_on: "2021-06-22",
    },
  ]);
  //
  const [addDisplay, setAddDisplay] = useState(false);
  //
  const headers = [
    { label: "Year", key: "year" },
    { label: "Jan(Wh/m²)", key: "jan" },
    { label: "Feb(Wh/m²)", key: "feb" },
    { label: "Mar(Wh/m²)", key: "mar" },
    { label: "Apr(Wh/m²)", key: "Apr" },
    { label: "May(Wh/m²)", key: "may" },
    { label: "Jun(Wh/m²)", key: "jun" },
    { label: "Jul(Wh/m²)", key: "jul" },
    { label: "Aug(Wh/m²)", key: "aug" },
    { label: "Sep(Wh/m²)", key: "sep" },
    { label: "Oct(Wh/m²)", key: "oct" },
    { label: "Nov(Wh/m²)", key: "nov" },
    { label: "Dec(Wh/m²)", key: "dec" },
  ];
  useEffect(() => {
    let datacopy = [];
    axios.get(`/entityget?id=${props.siteid}`).then((response) => {
      if (response.data) {
        response.data.irradiationBudget.map((item, index) => {
          datacopy.push({
            year: item.year,
            jan: item.value[0],
            feb: item.value[1],
            mar: item.value[2],
            apr: item.value[3],
            may: item.value[4],
            jun: item.value[5],
            jul: item.value[6],
            aug: item.value[7],
            sep: item.value[8],
            oct: item.value[9],
            nov: item.value[10],
            dec: item.value[11],
            updated_by: item.updatedby,
            updated_on: item.updatedon,
          });
        });
        setData(datacopy);
      }
    });
  }, [props.siteid, props.productionBudget]);
  return (
    <div className="production-input">
      <header>
        <div>Theoretical Irradiation Input (Wh/m²)</div>
        <div>Please download the template first for batch import</div>
        <div>
          <CSVLink
            data={[]}
            headers={headers}
            filename={"budget-production-template.csv"}
            className="template"
          >
            Download Template
          </CSVLink>
        </div>
        <div>
          <div
            onClick={() => {
              setAddDisplay(!addDisplay);
            }}
            tabIndex="0"
            onBlur={() => setAddDisplay(false)}
          >
            <span>
              <AiIcons.AiOutlinePlus />
            </span>
            <span>Add</span>
            <span>
              <RiIcons.RiArrowDownSFill />
            </span>
          </div>
          {addDisplay && (
            <div onMouseDown={(e) => e.preventDefault()}>
              <div onClick={() => props.handleSetAddRecordDisplay(true)}>
                Input Budget
              </div>
              <div>Batch Import</div>
            </div>
          )}
        </div>
      </header>
      <section>
        <div className="table-container">
          <table id="myTable" className="table">
            <thead>
              <tr>
                <th scope="col">Year</th>
                <th scope="col">Jan(Wh/m²)</th>
                <th scope="col">Feb(Wh/m²)</th>
                <th scope="col">Mar(Wh/m²)</th>
                <th scope="col">Apr(Wh/m²)</th>
                <th scope="col">May(Wh/m²)</th>
                <th scope="col">Jun(Wh/m²)</th>
                <th scope="col">Jul(Wh/m²)</th>
                <th scope="col">Aug(Wh/m²)</th>
                <th scope="col">Sep(Wh/m²)</th>
                <th scope="col">Oct(Wh/m²)</th>
                <th scope="col">Nov(Wh/m²)</th>
                <th scope="col">Dec(Wh/m²)</th>
                <th scope="col">Updated by</th>
                <th scope="col">Updated on</th>
                <th scope="col">Operation</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                return (
                  <tr>
                    <td>{item.year}</td>
                    <td>{item.jan}</td>
                    <td>{item.feb}</td>
                    <td>{item.mar}</td>
                    <td>{item.apr}</td>
                    <td>{item.may}</td>
                    <td>{item.jun}</td>
                    <td>{item.jul}</td>
                    <td>{item.aug}</td>
                    <td>{item.sep}</td>
                    <td>{item.oct}</td>
                    <td>{item.nov}</td>
                    <td>{item.dec}</td>
                    <td>{item.updated_by}</td>
                    <td>{item.updated_on}</td>
                    <td>
                      <span
                        onClick={() => {
                          props.handleSetEditRecordDisplay(true, item, index);
                        }}
                      >
                        <AiIcons.AiOutlineEdit />
                      </span>
                      <span
                        onClick={() => {
                          props.handleSetDeleteRecordDisplay(true, index);
                        }}
                      >
                        <RiIcons.RiDeleteBin6Line />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
