import React, { useEffect, useState } from "react";
import { getUser, setSiteidSession } from "../../../Utils/Common";
import "./TopologyAnalysis.css";
import axios from "axios";
import config from "../../../../config.json";
import * as RiIcons from "react-icons/ri";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as FiIcons from "react-icons/fi";
import TopologyStringState from "./topology-stringstate/TopologyStringState";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
export default function TopologyAnalysis(props) {
  const [sitedisplay, setSitedisplay] = useState(false);
  const [siteselect, setSiteselect] = useState({});
  const [entities, setEntities] = useState({});
  let { id } = useParams();
  const PF = process.env.REACT_APP_SITE_IMAGE_FOLDER;
  useEffect(() => {
    const fetchdata1 = async () => {
      var user = getUser();
      let entitiesget = await Promise.all(
        user.siteid.map((item, index) =>
          axios
            .get(`${config.SERVER_URL}/entityget?id=${item}`)
            .then((response) => response.data)
        )
      );
      setEntities(entitiesget);
      axios.get(`${config.SERVER_URL}/entityget?id=${id}`).then((response) => {
        if (response.data) {
          setSiteselect(response.data);
        }
      });
    };
    fetchdata1();
  }, [id]);
  let interval;
  const [inter, setInter] = useState(true);
  const formatDate = (datevar) => {
    var dd = String(datevar.getDate()).padStart(2, "0");
    var mm = String(datevar.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = datevar.getFullYear();
    var day = yyyy + "-" + mm + "-" + dd;
    return day;
  };
  let [data, setData] = useState({
    ghi: null,
    activepower: null,
    yield: null,
  });
  let datevar = formatDate(new Date());
  let year = datevar.split("-")[0];
  let month = datevar.split("-")[1];
  let day = datevar.split("-")[2];
  useEffect(() => {
    const getData = () => {
      axios
        .get("/topologyanalysis/infor", {
          params: {
            siteid: id,
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
  }, [id]);
  return (
    <div className="topology-analysis">
      <div className="topology-analysis-header">
        <div
          className="topology-analysis-header-sitedisplay"
          onClick={() => setSitedisplay(!sitedisplay)}
          tabIndex="0"
          onBlur={() => setSitedisplay(false)}
        >
          <div>{siteselect.name}</div>
          <div>
            <RiIcons.RiArrowDownSFill />
          </div>
        </div>
        {sitedisplay && (
          <div className="topology-analysis-header-sitedisplay-dropdown">
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
                    to={`/dashboard/analyse/topologyanalysis/${item.id}`}
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
      <div className="topology-analysis-body">
        <div className="topology-analysis-body-row-1">
          <div>
            <img src={PF + siteselect.image} />
          </div>
          <div>
            <div>
              <span>Normal</span>
              <span>{siteselect.name}</span>
            </div>
            <div>
              <div>
                <span>
                  <AiIcons.AiOutlineThunderbolt />
                </span>
                <span>Capacity:</span>
                <span>{siteselect.Capacity} MWp</span>
              </div>
              <div>
                <span>
                  <BiIcons.BiTachometer />
                </span>
                <span>Active Power:</span>
                <span> {data.activepower} W</span>
              </div>
              <div>
                <span>
                  <AiIcons.AiOutlineClockCircle />
                </span>
                <span>Yield Today:</span>
                <span> {data.yield} h</span>
              </div>
              <div>
                <span>
                  <FiIcons.FiSun />
                </span>
                <span>Irradiance:</span>
                <span> {data.ghi} W/㎡</span>
              </div>
            </div>
          </div>
        </div>
        <div className="topology-analysis-body-row-2">
          <TopologyStringState siteid={siteselect.id} />
        </div>
      </div>
    </div>
  );
}
