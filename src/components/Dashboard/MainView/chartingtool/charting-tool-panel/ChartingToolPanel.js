import React, { useEffect, useState } from "react";
import "./ChartingToolPanel.css";
import * as RiIcons from "react-icons/ri";
import * as TiIcons from "react-icons/ti";
import { getToken } from "../../../../Utils/Common";
import axios from "axios";
import config from "../../../../../config.json";
export default function ChartingToolPanel(props) {
  const [loading, setLoading] = useState(false);
  const [datatype, SetDatatype] = useState({});
  const [deviceDisplay, setDeviceDisplay] = useState([]);
  const [devicelist, setDevicelist] = useState([]);
  const [display, setDisplay] = useState([]);
  const handleSetDisplay = (item1, index1, index) => {
    let displaycopy = [...display];
    if (displaycopy[index][index1] === null) {
      displaycopy[index][index1] = item1;
      setDisplay(displaycopy);
    } else {
      displaycopy[index][index1] = null;
      setDisplay(displaycopy);
    }
  };
  const [channelDisplay, setChannelDisplay] = useState([]);
  const handleSetChannelDisplay = (item1, index1, index) => {
    let channeldisplaycopy = [...channelDisplay];
    if (channeldisplaycopy[index][index1] === null) {
      channeldisplaycopy[index][index1] = item1;
      setChannelDisplay(channeldisplaycopy);
    } else {
      channeldisplaycopy[index][index1] = null;
      setChannelDisplay(channeldisplaycopy);
    }
  };
  const handleSetDeviceDisplay = (index) => {
    let devicedisplaycopy = [...deviceDisplay];
    devicedisplaycopy[index] = !devicedisplaycopy[index];
    setDeviceDisplay(devicedisplaycopy);
  };
  const [kindChart, setKindChart] = useState([]);
  const handleSetKindChart = (index, index1, index2, value) => {
    let kindchartcopy = [...kindChart];
    kindchartcopy[index][index1][index2] = value;
    setKindChart(kindchartcopy);
    handleSetKindChartDisplay(index, index1, index2);
  };
  const [kindChartDisplay, setKindChartDisplay] = useState([]);
  const handleSetKindChartDisplay = (index, index1, index2) => {
    let kindchartdisplaycopy = [...kindChartDisplay];
    kindchartdisplaycopy[index][index1][index2] =
      !kindchartdisplaycopy[index][index1][index2];
    setKindChartDisplay(kindchartdisplaycopy);
  };
  const handleApply = () => {
    let yaxis = [];
    let url = [];
    let schema = [
      {
        name: "Date",
        type: "date",
        format: "%Y-%m-%d %H:%M:%S",
      },
    ];
    let column = [];
    let tag = "";
    display.map((item, index) => {
      item.map((item1, index1) => {
        if (item1 !== null) {
          channelDisplay[index].map((item3, index3) => {
            if (item3 !== null) {
              url.push([
                `/entitygetrecords?id=${item1.id}&attrs=${item3.value}&interval=day&filter=all`,
                item3.value,
              ]);
              tag = tag + item3.name + ", ";
              schema.push({
                name: item1.name + " " + item3.name,
                type: "number",
              });
              yaxis.push({
                style: {
                  title: {
                    display: "none",
                  },
                  "tick-mark": {
                    "stroke-width": "0",
                  },
                  label: {
                    fill: "white",
                  },
                  "grid-line": {
                    "stroke-width": "",
                    "stroke-dasharray": "5",
                    stroke: "hsla(0,0%,100%,.6)",
                  },
                },
                plot: [
                  {
                    value: item1.name + " " + item3.name,
                    connectnulldata: true,
                    type:
                      kindChart[index][index1][index3] === "Line"
                        ? "smooth-line"
                        : "column",
                  },
                ],
                format: {
                  suffix: item3.unit,
                },
              });
            }
          });
        }
      });
    });
    props.handleSetName("");
    props.handleSetYaxis(yaxis);
    props.handleSetUrl(url);
    props.handleSetSchema(schema);
    props.handleSetTag(tag);
    props.handleApply();
  };
  useEffect(() => {
    const getData = async () => {
      const token = getToken();
      const [firstResponse] = await Promise.all([
        axios
          .get(`/get_datatype_infor?token=${token}`)
          .then((response) => response.data),
      ]);
      SetDatatype(firstResponse);
      let url = [];
      Object.keys(firstResponse).map((item, index) => {
        url.push(
          axios
            .get(`/entityget?ancestor=${props.siteid}&kind=${item}`)
            .then((response) => response.data)
        );
      });
      const secondResponse = await Promise.all(url);
      setDevicelist(secondResponse);
      //
      let displaycopy = [];
      secondResponse.map((item, index) => {
        let a = [];
        item.map((item1, index) => {
          a.push(null);
        });
        displaycopy.push(a);
      });
      setDisplay(displaycopy);
      setLoading(true);
      //
      let devicedisplaycopy = [];
      Object.keys(firstResponse).map((item) => {
        devicedisplaycopy.push(false);
      });
      setDeviceDisplay(devicedisplaycopy);
      //
      let channeldisplaycopy = [];
      Object.entries(firstResponse).map((item, index) => {
        let a = [];
        item[1].map((item1, index1) => {
          a.push(null);
        });
        channeldisplaycopy.push(a);
      });
      setChannelDisplay(channeldisplaycopy);
      //
      let kindchartcopy = [];
      let kindchartdisplaycopy = [];
      console.log(secondResponse);
      secondResponse.map((item, index) => {
        let a1 = [];
        let a2 = [];
        item.map((item1, index1) => {
          let b1 = [];
          let b2 = [];
          Object.entries(firstResponse).map((item3, index3) => {
            item3[1].map((item4) => {
              b1.push("Line");
              b2.push(false);
            });
          });
          a1.push(b1);
          a2.push(b2);
        });
        kindchartcopy.push(a1);
        kindchartdisplaycopy.push(a2);
      });
      setKindChart(kindchartcopy);
      setKindChartDisplay(kindchartdisplaycopy);
    };
    getData();
  }, [props.siteid]);
  if (loading) {
    return (
      <div className="charting-tool-panel">
        <header className="charting-tool-panel-header">
          <span>Settings</span>
          <span onClick={props.handleCollapse}>
            <span>Collapse</span>
            <span>
              <RiIcons.RiArrowUpSFill />
            </span>
          </span>
        </header>
        <section className="charting-tool-panel-section">
          <div className="charting-tool-panel-section-col-1">
            <div>
              <span></span>
              <span>Select the Object</span>
            </div>
            <div>
              <header>
                <span>
                  <RiIcons.RiArrowDownSFill />
                </span>
                <span>{props.sitename}</span>
              </header>
              <div>
                {Object.keys(datatype).map((item, index) => {
                  return (
                    <div>
                      <div className="devicetype-list">
                        {!deviceDisplay[index] && (
                          <span
                            onClick={() => {
                              handleSetDeviceDisplay(index);
                            }}
                          >
                            <RiIcons.RiArrowRightSFill />
                          </span>
                        )}
                        {deviceDisplay[index] && (
                          <span
                            onClick={() => {
                              handleSetDeviceDisplay(index);
                            }}
                          >
                            <RiIcons.RiArrowDownSFill />
                          </span>
                        )}
                        <span></span>
                        <span
                          onClick={() => {
                            handleSetDeviceDisplay(index);
                          }}
                        >
                          {item}
                        </span>
                      </div>
                      {deviceDisplay[index] && (
                        <div>
                          {devicelist[index].map((item1, index1) => {
                            return (
                              <div
                                className="device-list"
                                onClick={() =>
                                  handleSetDisplay(item1, index1, index)
                                }
                              >
                                <span>
                                  {display[index][index1] !== null && (
                                    <TiIcons.TiTick className="device-list-icon-tick" />
                                  )}
                                </span>
                                <span>{item1.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="charting-tool-panel-section-col-2">
            <div>
              <span></span>
              <span>Select the data</span>
            </div>
            {Object.entries(datatype).map((item, index) => {
              return (
                <div>
                  {display[index].filter((a) => a !== null).length == 0
                    ? false
                    : true && (
                        <div>
                          <header>{item[0]}</header>
                          <section>
                            {item[1].map((item1, index1) => {
                              return (
                                <div
                                  className="channels-select"
                                  onClick={() => {
                                    handleSetChannelDisplay(
                                      item1,
                                      index1,
                                      index
                                    );
                                  }}
                                >
                                  <span>
                                    {channelDisplay[index][index1] && (
                                      <TiIcons.TiTick className="device-list-icon-tick" />
                                    )}
                                  </span>
                                  <span>
                                    {item1.name} ({item1.unit})
                                  </span>
                                </div>
                              );
                            })}
                          </section>
                        </div>
                      )}
                </div>
              );
            })}
          </div>
          <div className="charting-tool-panel-section-col-3">
            <div>
              <span></span>
              <span>Display Mode</span>
            </div>
            {display.map((item, index) => {
              return item.map((item1, index1) => {
                if (item1 !== null) {
                  return (
                    <div className="device-channel-select">
                      <header>
                        <span></span>
                        <span>{item1.name}</span>
                      </header>
                      <section>
                        {channelDisplay[index].map((item2, index2) => {
                          if (item2 !== null) {
                            return (
                              <div>
                                <div>{item2.name}</div>
                                <div className="chart-select">
                                  <div
                                    onClick={() =>
                                      handleSetKindChartDisplay(
                                        index,
                                        index1,
                                        index2
                                      )
                                    }
                                  >
                                    <div>
                                      {kindChart[index][index1][index2]} Chart
                                    </div>
                                    <div>
                                      <RiIcons.RiArrowDownSFill />
                                    </div>
                                  </div>
                                  {kindChartDisplay[index][index1][index2] && (
                                    <div>
                                      <div
                                        onClick={() => {
                                          handleSetKindChart(
                                            index,
                                            index1,
                                            index2,
                                            "Line"
                                          );
                                        }}
                                      >
                                        Line Chart
                                      </div>
                                      <div
                                        onClick={() => {
                                          handleSetKindChart(
                                            index,
                                            index1,
                                            index2,
                                            "Bar"
                                          );
                                        }}
                                      >
                                        Bar Chart
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        })}
                      </section>
                    </div>
                  );
                }
              });
            })}
          </div>
        </section>
        <footer className="charting-tool-panel-footer">
          <button onClick={handleApply}>Apply</button>
        </footer>
      </div>
    );
  } else {
    return <div className="charting-tool-panel"></div>;
  }
}
