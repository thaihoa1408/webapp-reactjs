import React, { useEffect, useState } from "react";
import "./ChartingToolChart.css";
import FusionCharts from "fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
import ReactFC from "react-fusioncharts";
import * as MdIcons from "react-icons/md";
import * as FiIcons from "react-icons/fi";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as GoIcons from "react-icons/go";
import * as AiIcons from "react-icons/ai";
import { CSVLink } from "react-csv";
import { getToken } from "../../../../Utils/Common";
import config from "../../../../../config.json";
ReactFC.fcRoot(FusionCharts, TimeSeries);

/*class ChartingToolChart extends React.Component {
  constructor(props) {
    super(props);
    this.onFetchData = this.onFetchData.bind(this);
    this.state = {
      timeseriesDs: {
        type: "timeseries",
        renderAt: "container",
        width: "100%",
        height: "500",
        dataSource,
      },
    };
  }

  componentDidMount() {
    this.onFetchData();
  }
import * as RiIcons from "react-icons/ri";
  onFetchData() {
    Promise.all([dataFetch, schemaFetch]).then((res) => {
      const data = [
        ["2018-01-01 00:00:00.000", "64.62", "5.275", "5"],
        ["2018-01-01 01:00:00.000", "65.63", "7.098", "10"],
        ["2018-01-01 02:00:00.000", "65.75", "4.857", "15"],
        ["2018-01-01 03:00:00.000", "65.62", "5.725", "12"],
        ["2018-01-01 04:00:00.000", "65.13", "6.001", "20"],
      ];
      const schema = [
        {
          name: "Date",
          type: "date",
          format: "%Y-%m-%d %H:%M:%S.%L",
        },
        {
          name: "Energy",
          type: "number",
        },
        {
          name: "Temperature",
          type: "number",
        },
        {
          name: "Humidity",
          type: "number",
        },
      ];
      const fusionTable = new FusionCharts.DataStore().createDataTable(
        data,
        schema
      );
      const timeseriesDs = Object.assign({}, this.state.timeseriesDs);
      timeseriesDs.dataSource.data = fusionTable;
      this.setState({
        timeseriesDs,
      });
    });
  }

  render() {
    return (
      <div className="charting-tool-chart">
        <div className="charting-tool-chart-viewer">
          <header></header>
          <section>
            <ReactFC {...this.state.timeseriesDs} />
          </section>
        </div>
      </div>
    );
  }
}
export default ChartingToolChart;*/

export default function ChartingToolChart(props) {
  const formatDate = (date) => {
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var date_format = yyyy + "," + mm + "," + dd;
    return date_format;
  };
  const [period, setPeriod] = useState(false);
  /*var datestartcopy = new Date();
  datestartcopy.setDate(datestartcopy.getDate() - 1);*/
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
  const handleChangePeriod = async () => {
    setPeriodDisplay(false);
    onFetchData();
  };
  const [periodSelect, setPeriodSelect] = useState([true, false, false, false]);
  const handleSetPeriodSelect = (id) => {
    var date11 = new Date();
    var date22 = new Date();
    if (id === 0) {
      setPeriodSelect([true, false, false, false]);
      setDateend(date22);
      date2 = formatDate(date22);
      date11.setDate(date11.getDate() - 0);
      setDatestart(date11);
      date1 = formatDate(date11);
      onFetchData();
    }
    if (id === 1) {
      setPeriodSelect([false, true, false, false]);
      setDateend(date22);
      date2 = formatDate(date22);
      date11.setDate(date11.getDate() - 2);
      setDatestart(date11);
      date1 = formatDate(date11);
      onFetchData();
    }
    if (id === 2) {
      setPeriodSelect([false, false, true, false]);
      setDateend(date22);
      date2 = formatDate(date22);
      date11.setDate(date11.getDate() - 6);
      setDatestart(date11);
      date1 = formatDate(date11);
      onFetchData();
    }
    if (id === 3) {
      setPeriodSelect([false, false, false, true]);
      setDateend(date22);
      date2 = formatDate(date22);
      date11.setDate(date11.getDate() - 29);
      setDatestart(date11);
      date1 = formatDate(date11);
      onFetchData();
    }
  };
  //
  const [error, setError] = useState("");
  const [nameDisplay, setNameDisplay] = useState(
    props.name !== "" ? props.name : "New Analysis"
  );
  const [name, setName] = useState("Customized Analysis");
  const [description, setDescription] = useState(
    "Device Analysis-Tag: " + props.tag
  );
  const [saveDisplay, setSaveDisplay] = useState(false);
  const handleSave = () => {
    setSaveDisplay(true);
  };
  const handleCancelSave = () => {
    setSaveDisplay(false);
    setError("");
    setName("Customized Analysis");
    setDescription("Device Analysis-Tag: " + props.tag);
  };
  const handleConfirmSave = () => {
    if (name === "") {
      setError("Please fill name!");
      return;
    }
    axios
      .post(`/analysisadd`, {
        token: getToken(),
        name: name,
        description: description,
        url: props.url,
        schema: props.schema,
        yaxis: props.yaxis,
        siteid: props.siteid,
      })
      .then((response) => {
        setSaveDisplay(false);
        setNameDisplay(name);
        setError("");
      });
  };
  //

  const dataSource = {
    chart: {
      multicanvas: false,
      style: {
        canvas: {
          fill: "transparent",
          "fill-opacity": "0",
        },
        background: { fill: "transparent" },
      },
    },
    navigator: {
      height: 30,
      scrollbar: {
        style: {
          button: { display: "none" }, //SVGStyle | String
          arrow: { display: "none" }, //SVGStyle | String
          scroller: { display: "none" }, //SVGStyle | String
          grip: { display: "none" }, //SVGStyle | String
          track: { display: "none" }, //SVGStyle | String
        },
      },
      window: {
        style: {
          label: { fill: "white", "font-size": "15" },
          mask: { fill: "#1890ff" },
        },
      },
    },
    extensions: {
      standardRangeSelector: {
        enabled: "0",
      },
      customRangeSelector: {
        enabled: "0",
      },
    },
    legend: {
      style: {
        text: { fill: "#fff" },
      },
    },
    caption: {
      //text: "Energy & Temperature Measurements",
      style: {
        text: {
          fill: "#ff0000",
          "font-size": "30",
        },
      },
    },
    yaxis: props.yaxis,
  };
  const [timeseriesDs, setTimeseriesDs] = useState({
    type: "timeseries",
    renderAt: "container",
    width: "95%",
    height: "500",
    dataSource,
  });
  const onFetchData = async () => {
    /*Promise.all([dataFetch, schemaFetch]).then((res) => {
      const data = [
        ["2018-01-01 00:00:00.000", "64.62", "5.275"],
        ["2018-01-01 01:00:00.000", "65.63", "7.098"],
        ["2018-01-01 02:00:00.000", "65.75", "4.857"],
        ["2018-01-01 03:00:00.000", "65.62", "5.725"],
        ["2018-01-01 04:00:00.000", "65.13", "6.001"],
        ["2018-01-01 05:00:00.000", "65.87", "1.3"],
        ["2018-01-01 06:00:00.000", "66.38", "1.1"],
      ];
      const schema = [
        {
          name: "Date",
          type: "date",
          format: "%Y-%m-%d %H:%M:%S.%L",
        },
        {
          name: "Energy",
          type: "number",
        },
        {
          name: "Temperature",
          type: "number",
        },
      ];
      const fusionTable = new FusionCharts.DataStore().createDataTable(
        data,
        schema
      );
      const timeseries = Object.assign({}, timeseriesDs);
      timeseries.dataSource.data = fusionTable;
      setTimeseriesDs(timeseries);
    });*/

    let columnscopy = [];
    let headercopy = [];
    props.schema.map((item) => {
      columnscopy.push({ id: item.name, label: item.name, minWidth: 170 });
      headercopy.push({ label: item.name, key: item.name });
    });
    setColumns(columnscopy);
    setHeader(headercopy);
    let rowscopy = [];
    //
    let url = [];
    props.url.map((item, index) => {
      url.push(
        axios
          .get(item[0] + `&from=${date1}&to=${date2}`)
          .then((response) => response.data[`${item[1]}`])
      );
    });
    const rawdata = await Promise.all(url);
    let handleData = [];
    rawdata.map((item) => {
      if (item !== null) {
        let handleDataItem = [];
        item.map((item1) => {
          item1.all.map((item2) => handleDataItem.push(item2));
        });
        handleData.push(handleDataItem);
      } else {
        handleData.push(null);
      }
    });
    console.log(handleData);
    let data = [];
    let length = 0;
    rawdata.map((item) => {
      if (item !== null && length === 0) {
        if (item.length !== 0) {
          item.map((item1) => {
            length = length + item1.all.length;
          });
        }
      }
    });
    console.log(length);
    for (let i = 0; i < length; i++) {
      let a = [];
      let time = false;
      handleData.map((item, index) => {
        if (item !== null) {
          if (time === false) {
            a.push(
              item[i].t.split("T")[0] +
                " " +
                item[i].t.split("T")[1].slice(0, 8)
            );
            time = true;
          }
          a.push(item[i].v.toString());
        } else {
          a.push(null);
        }
      });
      data.push(a);
      let rowschema = {};
      columnscopy.map((item, index) => {
        rowschema[`${item.id}`] = a[index];
      });
      rowscopy.push(rowschema);
    }

    setRows(rowscopy);
    const schema = [...props.schema];
    const fusionTable = new FusionCharts.DataStore().createDataTable(
      data,
      schema
    );
    const timeseries = Object.assign({}, timeseriesDs);
    timeseries.dataSource.data = fusionTable;
    setTimeseriesDs(timeseries);
  };
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [header, setHeader] = useState([]);
  const useStyles = makeStyles({
    root: {
      width: "100%",
      backgroundColor: "transparent",
      color: "white",
    },
    container: {
      maxHeight: 700,
    },
    row: {
      position: "relative",
    },
    header: {
      backgroundColor: "rgba(0, 0, 0, 0.3);",
      color: "white",
      fill: "white",
      borderBottomStyle: "solid",
      borderBottomColor: "rgba(242, 242, 244, 0.1)",
      borderBottomWidth: "1",
      borderRightStyle: "solid",
      borderRightColor: "rgba(242, 242, 244, 0.1)",
      zIndex: 50,
    },
    pagination: {
      backgroundColor: "transparent",
      color: "white",
    },
    bodyeven: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      color: "white",
      borderBottomStyle: "solid",
      borderBottomColor: "rgba(242, 242, 244, 0.1)",
      borderBottomWidth: "1",
      borderRightStyle: "solid",
      borderRightColor: "rgba(242, 242, 244, 0.1)",
    },
    bodyeven1: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      color: "white",
      borderBottomStyle: "solid",
      borderBottomColor: "rgba(242, 242, 244, 0.1)",
      borderBottomWidth: "1",
      borderRightStyle: "solid",
      borderRightColor: "rgba(242, 242, 244, 0.1)",
    },
    bodyodd: {
      backgroundColor: "rgba(0, 0, 0, 0.35)",
      color: "white",
      borderBottomStyle: "solid",
      borderBottomColor: "rgba(242, 242, 244, 0.1)",
      borderBottomWidth: "1",
      borderRightStyle: "solid",
      borderRightColor: "rgba(242, 242, 244, 0.1)",
    },
    bodyodd1: {
      backgroundColor: "rgba(0, 0, 0, 0.35)",
      color: "white",
      borderBottomStyle: "solid",
      borderBottomColor: "rgba(242, 242, 244, 0.1)",
      borderBottomWidth: "1",
      borderRightStyle: "solid",
      borderRightColor: "rgba(242, 242, 244, 0.1)",
    },
  });
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    onFetchData();
  }, []);
  return (
    <div className="charting-tool-chart">
      <div className="charting-tool-chart-header">
        <span>
          <MdIcons.MdKeyboardArrowLeft />
        </span>
        <span onClick={props.handleBack}>Back</span>
        <span></span>
        <span>{nameDisplay}</span>
        <button
          className={
            props.name !== "" || nameDisplay !== "New Analysis"
              ? "save-inactive"
              : "save-active"
          }
          onClick={handleSave}
          disabled={
            props.name !== "" || nameDisplay !== "New Analysis" ? true : false
          }
        >
          <span>
            <FiIcons.FiSave />
          </span>
          <span>Save</span>
        </button>
      </div>
      <div className="charting-tool-chart-period">
        <div
          className={periodSelect[0] ? "period-select active" : "period-select"}
          onClick={() => {
            handleSetPeriodSelect(0);
          }}
        >
          Today
        </div>
        <div
          className={periodSelect[1] ? "period-select active" : "period-select"}
          onClick={() => {
            handleSetPeriodSelect(1);
          }}
        >
          Last 3 days
        </div>
        <div
          className={periodSelect[2] ? "period-select active" : "period-select"}
          onClick={() => {
            handleSetPeriodSelect(2);
          }}
        >
          Last 7 days
        </div>
        <div
          className={periodSelect[3] ? "period-select active" : "period-select"}
          onClick={() => {
            handleSetPeriodSelect(3);
          }}
        >
          Last 30 days
        </div>
        <div>
          <div
            className="charting-tool-chart-period-infor"
            onClick={() => {
              setPeriodDisplay(!periodDisplay);
            }}
          >
            <div>
              {date1.split(",")[0] +
                "-" +
                date1.split(",")[1] +
                "-" +
                date1.split(",")[2]}
            </div>
            <div>-</div>
            <div>
              {date2.split(",")[0] +
                "-" +
                date2.split(",")[1] +
                "-" +
                date2.split(",")[2]}
            </div>
            <div>
              <GoIcons.GoCalendar />
            </div>
          </div>
          {periodDisplay && (
            <div>
              <div className="charting-tool-chart-period-dropdown">
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
              <div className="charting-tool-chart-period-dropdown-ok">
                <div onClick={handleChangePeriod}>Ok</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="charting-tool-chart-viewer">
        <header>Graph</header>
        <section>
          {timeseriesDs.dataSource.data ? (
            <ReactFC {...timeseriesDs} />
          ) : (
            "loading"
          )}
        </section>
      </div>
      <div className="charting-tool-chart-table">
        <header>
          Data
          <CSVLink
            className="charting-tool-chart-table-export"
            data={rows}
            headers={header}
            filename={"my-file.csv"}
          >
            <AiIcons.AiOutlineExport className="export-icon" />
            Export
          </CSVLink>
        </header>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow className={classes.row}>
                  {columns.map((column, index) => {
                    return (
                      <TableCell
                        className={classes.header}
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {columns.map((column, index1) => {
                          const value = row[column.id];

                          return (
                            <TableCell
                              className={
                                index % 2 === 0
                                  ? classes.bodyeven
                                  : classes.bodyodd
                              }
                              key={column.id}
                              align={column.align}
                            >
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className={classes.pagination}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      {saveDisplay && (
        <div className="charting-tool-chart-save">
          <div className="charting-tool-chart-save-container">
            <header>
              <span>Save</span>
              <span onClick={handleCancelSave}>
                <AiIcons.AiOutlineClose />
              </span>
            </header>
            <section>
              <div>
                <div>Name :</div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <div>Description :</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div>{error}</div>
            </section>
            <footer>
              <span onClick={handleCancelSave}>Cancel</span>
              <span onClick={handleConfirmSave}>Save</span>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
