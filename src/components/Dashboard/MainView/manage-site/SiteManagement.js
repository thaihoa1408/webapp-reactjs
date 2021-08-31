import React, { useEffect, useState, useRef, useCallback } from "react";
import "./SiteManagement.css";
import * as RiIcons from "react-icons/ri";
import * as GoIcons from "react-icons/go";
import * as TiIcons from "react-icons/ti";
import Calendar from "react-calendar";
import { getToken } from "../../../Utils/Common";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapGL from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import SiteListManage from "./sitelist/SiteListManage";
import config from "../../../../config.json";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoidGhhaWhvYTE0MDgiLCJhIjoiY2ttZnRneGN6MjFpbjJ1cWxvbWwwY2ZvYiJ9.M3hPbCBUOUpgUdxjryYI0g";
export default function SiteManagement() {
  const PF = process.env.REACT_APP_UPLOAD_URL;
  const [select, setSelect] = useState([true, false]);
  //

  //select power unit
  const [punitdisplay, setPunitdisplay] = useState(false);
  const [punitname, setPunitname] = useState("MWp");

  //select installationdate
  const [instdatedisplay, setInstdatedisplay] = useState(false);
  const formatDate = (date) => {
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var date_format = yyyy + "-" + mm + "-" + dd;
    return date_format;
  };
  const [installdate, setInstallDate] = useState(new Date());
  const handleSetinstalldate = (date) => {
    setInstallDate(date);
    setSitedetail({ ...siteDetail, installationDate: formatDate(date) });
  };
  var dateinfor = formatDate(installdate);

  // states and functions that help to locate site
  const [viewport, setViewport] = useState({
    latitude: 10.7732674,
    longitude: 106.659466,
    zoom: 10,
  });
  const [location, setLocation] = useState([null, null]);
  const mapRef = useRef();
  const handleViewportChange = useCallback((newViewport) => {
    setViewport(newViewport);
    setLocation([newViewport.latitude, newViewport.longitude]);
  }, []);
  const handleGeocoderViewportChange = useCallback((newViewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  }, []);

  // select image for a site
  const [file, setFile] = useState(null);
  const [siteimage, setSiteimage] = useState({
    file: "",
    imagePreviewUrl: "",
  });
  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setSiteimage({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };
  let $imagePreview = null;
  if (siteimage.imagePreviewUrl) {
    $imagePreview = <img src={siteimage.imagePreviewUrl} />;
  } else {
    $imagePreview = (
      <div className="previewText">Please select an Image for Site</div>
    );
  }

  // select account to associtate
  const [accountdisplay, setAccountdisplay] = useState(false);
  const [accountinfor, setAccountinfor] = useState([]);
  const [accountselect, setAccountselect] = useState(null);
  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    axios
      .get(`/get_user_infor?token=${token}`)
      .then((response) => setAccountinfor(response.data));
  }, []);

  const [siteDetail, setSitedetail] = useState({
    name: "",
    Capacity: "",
    installationDate: dateinfor,
    accountId: [null, null],
  });
  const [siteOwner, setSiteowner] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  //
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [siteCreated, setSitecreated] = useState(false);
  const [siteInfor, setSiteinfor] = useState({
    siteDetail: {
      name: "",
      Capacity: "",
      installationDate: "",
      accountId: [null, null],
    },
    location: [null, null],
    siteOwner: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });
  const handleCreatesite = () => {
    if (siteDetail.name === "") {
      setError("You must fill site name");
      return;
    }
    if (siteDetail.Capacity === "") {
      setError("You must fill Capacity");
      return;
    }
    setSiteinfor({
      siteDetail: siteDetail,
      location: location,
      siteOwner: siteOwner,
    });
    setError(null);
    setSitecreated(true);
  };
  //
  const handleConfirm = async () => {
    let fileName = "";
    if (file) {
      const data = new FormData();
      fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      try {
        await axios.post(PF + "/upload", data);
        console.log(data.get("name"));
      } catch (err) {
        console.log(err);
      }
    }
    try {
      const res = await axios.post(`/entityadd`, {
        data: {
          kind: "Site",
          name: siteInfor.siteDetail.name,
          installdate: siteInfor.siteDetail.installationDate,
          Capacity: siteInfor.siteDetail.Capacity,

          accountId: [siteInfor.siteDetail.accountId[0]],
          location: [siteInfor.location[0], siteInfor.location[1]],
          productionBudget: [],
          irradiationBudget: [],
          image: fileName,
          siteOwner: {
            firstName: siteInfor.siteOwner.firstName,
            lastName: siteInfor.siteOwner.lastName,
            email: siteInfor.siteOwner.email,
            phone: siteInfor.siteOwner.phone,
          },
        },
      });
      if (res.data.id) {
        var token = getToken();
        axios
          .post(`/assign_site`, {
            token: token,
            userid: siteInfor.siteDetail.accountId[1],
            siteid: res.data.id,
          })
          .then((response) => {
            setStatus("create site and assign to account successfully");
          });
      }
    } catch (err) {
      console.log(err);
    }
    setSitecreated(false);
    setSiteinfor(null);
  };
  const handleCancle = () => {
    setSitecreated(false);
    setSiteinfor(null);
  };

  return (
    <div
      className="site-manage"
      onClick={() => {
        if (punitdisplay) setPunitdisplay(false);
      }}
    >
      <div className="site-manage-background"></div>
      <div className="site-manage-header">
        <div
          className={select[0] ? "select-active" : "select-inactive"}
          onClick={() => setSelect([true, false])}
        >
          Site List
        </div>
        <div
          className={select[1] ? "select-active" : "select-inactive"}
          onClick={() => setSelect([false, true])}
        >
          Create new site
        </div>
      </div>
      {select[1] && (
        <div>
          <div className="site-manage-body">
            <div className="site-manage-body-row-1">
              <h2>Create New Site</h2>
            </div>
            <div className="site-mange-body-row-2">
              <div className="site-mange-body-row-2-left">
                <h3>Site Details</h3>
                <div>
                  <div>Site name:</div>
                  <input
                    type="text"
                    onChange={(e) =>
                      setSitedetail({ ...siteDetail, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <div>Capacity:</div>
                  <input
                    type="text"
                    onChange={(e) =>
                      setSitedetail({
                        ...siteDetail,
                        Capacity: e.target.value,
                      })
                    }
                  />
                  <div className="peak-power-unit">
                    <div>
                      <div style={{ marginLeft: 5 }}>{punitname}</div>
                    </div>
                    {punitdisplay && (
                      <div className="peak-power-unit-dropdown">
                        <div onClick={() => setPunitname("kWp")}>kWp</div>
                        <div onClick={() => setPunitname("Wp")}>Wp</div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div>Installation Date: </div>
                  <div>
                    <div
                      className="installdate-infor"
                      onClick={() => setInstdatedisplay(!instdatedisplay)}
                      tabIndex="0"
                      onBlur={() => setInstdatedisplay(false)}
                    >
                      <div>{dateinfor}</div>
                      <div>
                        <GoIcons.GoCalendar />
                      </div>
                    </div>
                    {instdatedisplay && (
                      <div
                        className="installdate-dropdown"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <Calendar
                          onChange={handleSetinstalldate}
                          value={installdate}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div>Associated to account:</div>
                  <div>
                    <div
                      className="account-link-infor"
                      onClick={() => setAccountdisplay(!accountdisplay)}
                      tabIndex="0"
                      onBlur={() => setAccountdisplay(false)}
                    >
                      <div>{accountselect}</div>
                      <div>
                        <RiIcons.RiArrowDownSFill />
                      </div>
                    </div>
                    {accountdisplay && (
                      <div className="account-link-dropdown">
                        {accountinfor.map((item, index) => {
                          return (
                            <div
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setAccountselect(item.username);
                                setAccountdisplay(false);
                                setSitedetail({
                                  ...siteDetail,
                                  accountId: [item.username, item.id],
                                });
                              }}
                            >
                              {item.username}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <h3>Site Owner</h3>
                <div className="site-owner-infor">
                  <div>First name:</div>
                  <input
                    type="text"
                    onChange={(e) =>
                      setSiteowner({ ...siteOwner, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="site-owner-infor">
                  <div>Last name:</div>
                  <input
                    type="text"
                    onChange={(e) =>
                      setSiteowner({ ...siteOwner, lastName: e.target.value })
                    }
                  />
                </div>
                <div className="site-owner-infor">
                  <div>Phone:</div>
                  <input
                    type="text"
                    onChange={(e) =>
                      setSiteowner({ ...siteOwner, phone: e.target.value })
                    }
                  />
                </div>
                <div className="site-owner-infor">
                  <div>Email:</div>
                  <input
                    type="text"
                    onChange={(e) =>
                      setSiteowner({ ...siteOwner, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="site-mange-body-row-2-center">
                <div className="site-locate-infor">
                  <h4>Site Locatation:</h4>
                  <div>
                    <div>latitude:</div>
                    <input
                      type="text"
                      placeholder={location[0]}
                      onChange={(e) => {
                        setLocation([e.target.value, location[1]]);
                      }}
                    />
                    <div>longitude:</div>
                    <input
                      type="text"
                      placeholder={location[1]}
                      onChange={(e) => {
                        setLocation([location[0], e.target.value]);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <MapGL
                    ref={mapRef}
                    {...viewport}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    width="100%"
                    height="100%"
                    onViewportChange={handleViewportChange}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                  >
                    <Geocoder
                      mapRef={mapRef}
                      onViewportChange={handleGeocoderViewportChange}
                      mapboxApiAccessToken={MAPBOX_TOKEN}
                      position="top-left"
                    />
                  </MapGL>
                </div>
              </div>
              <div className="site-mange-body-row-2-right">
                <h4>Site Image:</h4>
                <div className="preview-image">
                  {file && (
                    <img
                      className="shareImg"
                      src={URL.createObjectURL(file)}
                      alt=""
                    />
                  )}
                </div>
                <input
                  className="fileInput"
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>
            <div className="site-mange-body-row-3">
              <button onClick={handleCreatesite}>Create Site</button>
              <span className="error-site-management">{error}</span>
              <span className="status-site-management">{status}</span>
            </div>
          </div>
          {siteCreated && (
            <div className="data-site-infor">
              <div className="data-site-infor-row-1">
                <div>
                  <div>In Progress</div>
                </div>
                <div>
                  <div>
                    <h4>Site Details</h4>
                    <ul>
                      <li>
                        Name: <span>{siteInfor.siteDetail.name}</span>
                      </li>
                      <li>
                        Capacity: <span>{siteInfor.siteDetail.Capacity}</span>
                      </li>
                      <li>
                        Installation date:{" "}
                        <span>{siteInfor.siteDetail.installationDate}</span>
                      </li>
                      <li>
                        Account:{" "}
                        <span>{siteInfor.siteDetail.accountId[0]}</span>
                      </li>
                      <li>
                        Site location:{" "}
                        <span>
                          [{siteInfor.location[0]}, {siteInfor.location[1]}]
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4>Site Owner</h4>
                    <ul>
                      <li>
                        First name: <span>{siteInfor.siteOwner.firstName}</span>
                      </li>
                      <li>
                        Last name: <span>{siteInfor.siteOwner.lastName}</span>
                      </li>
                      <li>
                        Phone: <span>{siteInfor.siteOwner.phone}</span>
                      </li>
                      <li>
                        Email: <span>{siteInfor.siteOwner.email}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="data-site-infor-row-2">
                <div onClick={handleConfirm}>Confirm</div>
                <div onClick={handleCancle}>Cancel</div>
              </div>
            </div>
          )}
        </div>
      )}
      {select[0] && <SiteListManage />}
    </div>
  );
}
