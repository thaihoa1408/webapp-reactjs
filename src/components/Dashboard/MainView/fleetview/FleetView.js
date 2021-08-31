import React, { useState, useEffect } from "react";
import "./FleetView.css";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import MapGL from "react-map-gl";
import * as MapboxGl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as TiIcons from "react-icons/ti";
import axios from "axios";
import { getUser, setSiteidSession } from "../../../Utils/Common";
import ActivePower from "./active-power/ActivePower";
import OverviewToday from "./overview-today/OverviewToday";
import config from "../../../../config.json";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
function FleetView(props) {
  //
  const PF = process.env.REACT_APP_SITE_IMAGE_FOLDER;
  //set the parameters of mapbox
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: 10.7732674,
    longitude: 106.659466,
    zoom: 13,
  });
  //use to display the popup when we click the site on map
  const [popupInfo, setPopupInfo] = useState(false);
  const [popuplocation, setPopuplocation] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  //Entities is used to store information of sites
  const [entities, setEntities] = useState([]);
  const [siteDisplay, SetSiteDisplay] = useState(false);
  //siteselect is used to save the information of selected site.
  const [siteselect, setSiteselect] = useState({});
  let { id } = useParams();
  //request information of sites from backend
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
          setSiteselect(response.data);
        }
      });
    };
    fetchdata1();
  }, [id]);
  //variable is used to store the value of total production, site active power, site irradiance.
  const [data, setData] = useState([]);
  const [totalProduction, setTotalProduction] = useState(null);
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
      let user = getUser();
      axios
        .get(`/fleetview/map`, {
          params: {
            siteids: user.siteid,
            time: "day",
            date: year + "," + month + "," + day,
          },
        })
        .then((response) => {
          setData(response.data);
          let totalproduction = null;
          response.data.map((item) => {
            totalproduction = totalproduction + item.production;
          });
          setTotalProduction(totalproduction);
        });
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
  }, [id, inter]);
  return (
    <div className="fleetview">
      <div className="fleetview-header">
        <div>
          <AiIcons.AiOutlineThunderbolt />
          SiteList
        </div>
        <div>Sites: {entities.length}</div>
        <div>Fleet Capacity: {siteselect.Capacity} MWp</div>
        <div>Total Production: {totalProduction / 1000} MWh</div>
      </div>
      <div className="fleetview-body">
        <div className="fleetview-body-map">
          <MapGL
            {...viewport}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            width="100%"
            height="100%"
            onViewportChange={(viewport) => setViewport(viewport)}
            mapboxApiAccessToken="pk.eyJ1IjoidGhhaWhvYTE0MDgiLCJhIjoiY2ttZnRneGN6MjFpbjJ1cWxvbWwwY2ZvYiJ9.M3hPbCBUOUpgUdxjryYI0g"
          >
            {entities.map((item, index) => {
              return (
                <Marker
                  latitude={item.location[0]}
                  longitude={item.location[1]}
                >
                  <img
                    src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
                    width={viewport.zoom * 2}
                    height={viewport.zoom * 2}
                    onClick={() => {
                      setPopupInfo(!popupInfo);
                      setPopuplocation([
                        item.location[0],
                        item.location[1],
                        item.name,
                        data[index].activepower,
                        data[index].ghi,
                      ]);
                    }}
                  />
                </Marker>
              );
            })}

            {popupInfo && (
              <Popup
                tipSize={5}
                anchor="bottom"
                longitude={popuplocation[1]}
                latitude={popuplocation[0]}
                closeOnClick={false}
                onClose={() => setPopupInfo(false)}
              >
                <div className="popup">
                  <div>{popuplocation[2]}</div>
                  <div>Active power : {popuplocation[3]} kW</div>
                  <div>Irradiance: {popuplocation[4]} W/㎡</div>
                </div>
              </Popup>
            )}
          </MapGL>
        </div>
        <div className="fleetview-body-table">
          <div className="fleetview-body-table-row-1">
            <div
              className="fleetview-body-table-sitedisplay"
              onClick={() => SetSiteDisplay(!siteDisplay)}
              tabIndex="0"
              onBlur={() => SetSiteDisplay(false)}
            >
              <div>{siteselect.name}</div>
              <div>
                <RiIcons.RiArrowDownSFill />
              </div>
            </div>
            {siteDisplay && (
              <div className="fleetview-body-table-sitedisplay-dropdown">
                {entities.map((item, index) => {
                  return (
                    <div
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        SetSiteDisplay(false);
                        setSiteidSession(item.id);
                        props.handleSetSiteid(item.id);
                      }}
                    >
                      <Link
                        to={`/dashboard/central-monitor/fleetview/${item.id}`}
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
          <div className="fleetview-body-table-row-2">
            <div>
              <TiIcons.TiLocationOutline className="icon-location" />
            </div>
            <div>
              <div>
                Latitude {siteselect.location ? siteselect.location[0] : ""}
              </div>
              <div>
                Longitude {siteselect.location ? siteselect.location[1] : ""}
              </div>
            </div>
          </div>
          <div className="fleetview-body-table-row-3">
            <img src={PF + siteselect.image} />
          </div>
          <div className="fleetview-body-table-row-4">
            <ActivePower
              siteid={siteselect.id}
              sitecapacity={siteselect.Capacity}
            />
            <OverviewToday
              siteid={siteselect.id}
              sitecapacity={siteselect.Capacity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FleetView;
