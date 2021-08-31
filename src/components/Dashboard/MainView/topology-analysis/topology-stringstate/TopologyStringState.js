import React, { useEffect, useState } from "react";
import "./TopologyStringState.css";
import axios from "axios";
import config from "../../../../../config.json";
export default function TopologyStringState(props) {
  const [select, setSelect] = useState([true, false]);
  const handleSetSelect = (value) => {
    if (value === 1) {
      setSelect([true, false]);
    }
    if (value === 2) {
      setSelect([false, true]);
    }
  };
  //
  const [hover, setHover] = useState(null);
  const [inverterSelect, setInverterSelect] = useState(0);
  const handleSetInverterSelect = (value) => {
    setInverterSelect(value);
  };
  const [data, setData] = useState([]);
  const [inter, setInter] = useState(true);
  let interval;
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
    const getData = () => {
      axios
        .get("/topologyanalysis/stringstate", {
          params: {
            siteid: props.siteid,
            time: "day",
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
  }, [props.siteid]);
  return (
    <div className="topology-stringstate">
      <header>
        <div
          className={select[0] ? "active" : "null"}
          onClick={() => handleSetSelect(1)}
        >
          <span>Topology Analysis</span>
          <span>
            Transformer:<span>0</span>/0
          </span>
          <span>
            Inverter:<span>{data.length}</span>/{data.length}
          </span>
        </div>
        <div
          className={select[1] ? "active" : "null"}
          onClick={() => handleSetSelect(2)}
        >
          String State
        </div>
      </header>
      {select[0] && (
        <section>
          <div className="col-1">
            {data.map((item, index) => {
              return (
                <div>
                  <div
                    className={inverterSelect === index ? "active" : "null"}
                    onClick={() => handleSetInverterSelect(index)}
                    onMouseMove={() => {
                      setHover(index);
                    }}
                    onMouseOut={() => {
                      setHover(null);
                    }}
                  >
                    <div>{item.name}</div>
                    <div>{item.yield}h</div>
                  </div>
                  <div className={hover === index ? "active" : "null"}>
                    <div>
                      <div>Full Capacity</div>
                      <div>{item.name}</div>
                    </div>
                    <div>
                      String Inverter | Device is in unscontrained operation
                      state
                    </div>
                    <div>
                      Yield: {item.yield}h | Deviation: {item.deviation}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-2">
            <div>
              <div></div>
              <div>
                {data[inverterSelect] !== undefined
                  ? data[inverterSelect].name
                  : null}
              </div>
            </div>
            <div>
              String Inverter |{" "}
              {data[inverterSelect] !== undefined
                ? data[inverterSelect].state
                : null}
            </div>
            <div>
              <div>
                Deviation:{" "}
                {data[inverterSelect] !== undefined
                  ? data[inverterSelect].deviation
                  : null}
                %
              </div>
              <div>
                Internal Temp:{" "}
                {data[inverterSelect] !== undefined
                  ? data[inverterSelect].internal_temp
                  : null}
                ℃
              </div>
              <div>
                Efficiency:{" "}
                {data[inverterSelect] !== undefined
                  ? data[inverterSelect].efficiency
                  : null}
                %
              </div>
            </div>
            <div>
              {data[inverterSelect] !== undefined
                ? data[inverterSelect].string_current.map((item, index) => {
                    return (
                      <div
                        className={
                          item === false
                            ? "string-current-nouse"
                            : "string-current-use"
                        }
                      >
                        <div>Current{index + 1}</div>
                        <div>{item}A</div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </section>
      )}
      {select[1] && (
        <section>
          <div className="string-state">
            {data.map((item, index) => {
              return (
                <div>
                  <div>
                    <div>
                      <div>Inverter</div>
                      <div>{item.name}</div>
                      <div>Deviation: {item.deviation}%</div>
                    </div>
                    <div></div>
                  </div>
                  <div></div>
                  <div>
                    {item.string_current.map((item1, index1) => {
                      return (
                        <div
                          className={
                            item1 === false
                              ? "string-state-current-nouse"
                              : "string-state-current-use"
                          }
                        >
                          <div>String{index1 + 1}</div>
                          <div>{item1}A</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
