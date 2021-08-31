import React, { useEffect, useState } from "react";
import "./ChartingTool.css";
import * as RiIcons from "react-icons/ri";
import * as AiIcons from "react-icons/ai";
import { getToken, getUser, setSiteidSession } from "../../../Utils/Common";
import axios from "axios";
import ChartingToolPanel from "./charting-tool-panel/ChartingToolPanel";
import ChartingToolChart from "./charting-tool-chart/ChartingToolChart";
import ChartingToolCard from "./charting-tool-card/ChartingToolCard";
import config from "../../../../config.json";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
export default function ChartingTool(props) {
  const [sitedisplay, setSitedisplay] = useState(false);
  const [siteselect, setSiteselect] = useState([null, null]);
  const [entities, setEntities] = useState([]);
  const [select, setSelect] = useState([true, false]);
  const handleSelect = (id) => {
    if (id === 0) {
      setSelect([true, false]);
    }
    if (id === 1) {
      setSelect([false, true]);
    }
  };
  const [templateKindDisplay, setTemplateKindDisplay] = useState(false);
  const [templateKindSelect, setTemplateKindSelect] = useState(null);
  const handleSetTemplateKindSelect = (item) => {
    setTemplateKindSelect(item);
    setTemplateKindDisplay(false);
    setTemplatePanelDisplay(false);
    setDataPanelDisplay(true);
    setChartPanelDisplay(false);
  };
  const handleCollapse = () => {
    setTemplatePanelDisplay(true);
    setDataPanelDisplay(false);
    setChartPanelDisplay(false);
    setTemplateKindSelect(null);
  };
  const handleApply = () => {
    setTemplatePanelDisplay(false);
    setDataPanelDisplay(false);
    setChartPanelDisplay(true);
  };
  const handleBack = () => {
    setTemplatePanelDisplay(true);
    setDataPanelDisplay(false);
    setChartPanelDisplay(false);
  };
  const [yaxis, setYaxis] = useState([]);
  const handleSetYaxis = (item) => {
    setYaxis(item);
  };
  const [url, setUrl] = useState([]);
  const handleSetUrl = (item) => {
    setUrl(item);
  };
  const [schema, setSchema] = useState([]);
  const handleSetSchema = (item) => {
    setSchema(item);
  };
  const [tag, setTag] = useState("");
  const handleSetTag = (item) => {
    setTag(item);
  };
  const [name, setName] = useState("");
  const handleSetName = (item) => {
    setName(item);
  };
  const handleChooseCard = (item) => {
    setUrl(item.url);
    setYaxis(item.yaxis);
    setSchema(item.schema);
    setName(item.name);
    handleApply();
  };
  const [templatePanelDisplay, setTemplatePanelDisplay] = useState(true);
  const [dataPanelDisplay, setDataPanelDisplay] = useState(false);
  const [chartPanelDisplay, setChartPanelDisplay] = useState(false);
  const [deleteDisplay, setDeleteDisplay] = useState(false);
  const [itemDelete, setItemDelete] = useState("");
  const handleDelete = (item) => {
    setDeleteDisplay(true);
    setItemDelete(item.id);
  };
  const handleCancelDelete = () => {
    setDeleteDisplay(false);
    setItemDelete("");
  };
  const handleConfirmDelete = () => {
    var token = getToken();
    axios
      .post(`/analysisdelete`, {
        token: token,
        analysisId: itemDelete,
      })
      .then((response) => {
        handleCancelDelete();
        axios
          .get(`/analysisget?token=${token}`)
          .then((response) => setAnalysises(response.data));
      });
  };
  const [analysises, setAnalysises] = useState([]);
  let { id } = useParams();
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
          setSiteselect([response.data.name, response.data.id]);
        }
      });
    };
    fetchdata1();
    let token = getToken();
    axios
      .get(`/analysisget?token=${token}`)
      .then((response) => setAnalysises(response.data));
  }, [templatePanelDisplay, id]);
  return (
    <div className="charting-tool">
      <div className="charting-tool-header">
        <div
          className="charting-tool-header-sitedisplay"
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
          <div className="charting-tool-header-sitedisplay-dropdown">
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
                    to={`/dashboard/analyse/chartingtool/${item.id}`}
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
      <div className="charting-tool-body">
        {templatePanelDisplay && (
          <div className="charting-tool-container">
            <div className="charting-tool-body-header">
              <div
                className={
                  select[0]
                    ? "charting-tool-body-header-template active"
                    : "charting-tool-body-header-template"
                }
                onClick={() => handleSelect(0)}
              >
                My Template
              </div>
              <div
                className={
                  select[1]
                    ? "charting-tool-body-header-template active"
                    : "charting-tool-body-header-template"
                }
                onClick={() => handleSelect(1)}
              >
                System Template
              </div>
              <div className="charting-tool-body-header-analysis">
                <div
                  onClick={() => setTemplateKindDisplay(!templateKindDisplay)}
                  tabIndex="0"
                  onBlur={() => setTemplateKindDisplay(false)}
                >
                  <div>
                    <AiIcons.AiOutlinePlus />
                  </div>
                  <div>New Analysis</div>
                  <div>
                    <RiIcons.RiArrowDownSFill />
                  </div>
                </div>
                {templateKindDisplay && (
                  <div onMouseDown={(e) => e.preventDefault()}>
                    <div onClick={() => handleSetTemplateKindSelect("Trend")}>
                      Trend
                    </div>
                    <div onClick={() => handleSetTemplateKindSelect("Scatter")}>
                      Scatter
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="charting-tool-body-content">
              {analysises.map((item, index) => {
                if (item.siteid === id) {
                  return (
                    <div>
                      <ChartingToolCard
                        name={item.name}
                        description={item.description}
                        item={item}
                        handleChooseCard={handleChooseCard}
                        handleDelete={handleDelete}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
        {dataPanelDisplay && (
          <ChartingToolPanel
            sitename={siteselect[0]}
            siteid={siteselect[1]}
            handleCollapse={handleCollapse}
            handleApply={handleApply}
            handleSetYaxis={handleSetYaxis}
            handleSetUrl={handleSetUrl}
            handleSetSchema={handleSetSchema}
            handleSetTag={handleSetTag}
            handleSetName={handleSetName}
          />
        )}
        {chartPanelDisplay && (
          <ChartingToolChart
            siteid={siteselect[1]}
            handleBack={handleBack}
            yaxis={yaxis}
            url={url}
            schema={schema}
            tag={tag}
            name={name}
          />
        )}
      </div>
      {deleteDisplay && (
        <div className="charting-tool-delete-analysis">
          <div className="charting-tool-delete-analysis-container">
            <header>
              <span>Delete</span>
              <span onClick={handleCancelDelete}>
                <AiIcons.AiOutlineClose />
              </span>
            </header>
            <p>
              The template cannot be recovered after deletion. Really want to
              delete?
            </p>
            <div>
              <span onClick={handleCancelDelete}>Cancel</span>
              <span onClick={handleConfirmDelete}>Delete</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
