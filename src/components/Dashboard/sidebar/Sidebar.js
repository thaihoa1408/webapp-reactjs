import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import * as RiIcons from "react-icons/ri";
import "./Sidebar.css";
import axios from "axios";
import {
  getSiteid,
  getToken,
  getUser,
  removeUserSession,
} from "../../Utils/Common";
import config from "../../../config.json";
function Sidebar(props) {
  const [rightaccess, setRightaccess] = useState(false);
  let user = getUser();
  let siteid = getSiteid();
  const SidebarData = [
    {
      title: "Central Monitor",

      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: "Fleetview",
          path: `/dashboard/central-monitor/fleetview/${props.siteid}`,
        },
        {
          title: "Site List",
          path: "/dashboard/central-monitor/sitelist",
        },
        {
          title: "Leaderboard",
          path: "/dashboard/central-monitor/leaderboard",
        },
      ],
    },
    {
      title: "Site Monitor",

      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: "Site View",
          path: `/dashboard/site-monitor/siteview/${props.siteid}`,
        },
        {
          title: "Site KPI",
          path: `/dashboard/site-monitor/sitekpi/${props.siteid}`,
        },
        {
          title: "Device List",
          path: `/dashboard/site-monitor/devicelist/${props.siteid}`,
        },
      ],
    },
    {
      title: "Alarm",
      path: "/dashboard/alarm",
    },
    {
      title: "Analyze",
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: "Charting Tool",
          path: `/dashboard/analyse/chartingtool/${props.siteid}`,
        },
        {
          title: "Availability",
          path: `/dashboard/analyse/availability/${props.siteid}`,
        },
        {
          title: "Topology Analysis",
          path: `/dashboard/analyse/topologyanalysis/${props.siteid}`,
        },
      ],
    },
    {
      title: "Site Management",
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: "Budget Production Input",
          path: `/dashboard/site-management/budgetproductioninput/${props.siteid}`,
        },
        {
          title: "Budget Insolation Input",
          path: `/dashboard/site-management/budgetinsolationinput/${props.siteid}`,
        },
      ],
    },
    {
      title: "Data Report",

      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: "Data Export",
          path: `/dashboard/data-report/dataexport/${props.siteid}`,
        },
      ],
    },
  ];
  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    axios
      .get(`/api/test/admin?token=${token}`)
      .then((response) => {
        setRightaccess(true);
      })
      .catch((error) => {
        setRightaccess(false);
      });
  }, []);
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const [userinfor, setUserinfor] = useState(false);
  const showUserinfor = () => setUserinfor(!userinfor);
  const [showSubnav, setShowSubnav] = useState(null);
  const handleSetShowSubnav = (index) => {
    if (index === showSubnav) {
      setShowSubnav(null);
    } else {
      setShowSubnav(index);
    }
  };
  return (
    <div
      className={
        props.isShowSidebar ? "sidebar-container" : "sidebar-container active"
      }
    >
      <div className="sidebar-wrap">
        {SidebarData.map((item, index) => {
          if (item.path) {
            return (
              <>
                <NavLink
                  activeClassName="sidebar-link-active"
                  className="sidebar-link"
                  to={item.path}
                  onClick={() => handleSetShowSubnav(index)}
                >
                  <div>
                    <span className="sidebar-label">{item.title}</span>
                  </div>
                </NavLink>
              </>
            );
          } else {
            return (
              <>
                <Link
                  className="sidebar-link"
                  to={item.path}
                  onClick={() => handleSetShowSubnav(index)}
                >
                  <div>
                    <span className="sidebar-label">{item.title}</span>
                  </div>
                  <div>
                    {index === showSubnav ? item.iconOpened : item.iconClosed}
                  </div>
                </Link>
                <div
                  className={index === showSubnav ? "subnav active" : "subnav"}
                >
                  {item.subNav.map((item, index) => {
                    return (
                      <NavLink
                        activeClassName="dropdown-link-active"
                        className="dropdown-link"
                        to={item.path}
                        key={index}
                        onClick={props.handleSetShowSidebar}
                      >
                        <span className="sidebar-label">{item.title}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </>
            );
          }
        })}
      </div>
    </div>
  );
  /*return (
    <nav>
      <div className="navbars">
        <div className="navbar-icon" onClick={() => setSidebar(!sidebar)}>
          <FaIcons.FaBars />
        </div>
        <div className="dashboard-text">Dashboard</div>
        <div className="user-infor">
          <FaIcons.FaUserAlt />
          <div>{user.username}</div>
          <RiIcons.RiArrowDownSFill
            className="icon"
            onClick={showUserinfor}
            tabIndex="0"
            onBlur={() => setUserinfor(false)}
          />
          {userinfor && (
            <div
              className="user-infor-dropdown"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div>
                <AiIcons.AiFillLock />
                <div
                  onClick={() => {
                    setChangePassword(true);
                    showUserinfor(!userinfor);
                  }}
                >
                  Change Password
                </div>
              </div>
              <div>
                <BiIcons.BiLogOutCircle />
                <div onClick={props.handleLogout}>Logout</div>
              </div>
              {rightaccess && (
                <div>
                  <RiIcons.RiAccountBoxFill />
                  <Link
                    to="/dashboard/manage_account"
                    className="mange-account-text"
                    onClick={() => showUserinfor(!userinfor)}
                  >
                    Account Management
                  </Link>
                </div>
              )}
              {rightaccess && (
                <div>
                  <AiIcons.AiTwotoneSetting />
                  <Link
                    to="/dashboard/site_management"
                    className="mange-account-text"
                    onClick={() => showUserinfor(!userinfor)}
                  >
                    Site Management
                  </Link>
                </div>
              )}
              {rightaccess && (
                <div>
                  <AiIcons.AiFillEdit />
                  <Link
                    to="/dashboard/datatype_editor"
                    className="mange-account-text"
                    onClick={() => showUserinfor(!userinfor)}
                  >
                    Datatype Editor
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <nav className={sidebar ? "sidebar" : "sidebar active"}>
        <div className="sidebar-wrap">
          {SidebarData.map((item, index) => {
            if (item.path) {
              return (
                <>
                  <NavLink
                    activeClassName="sidebar-link-active"
                    className="sidebar-link"
                    to={item.path}
                    onClick={() => handleSetShowSubnav(index)}
                  >
                    <div>
                      <span className="sidebar-label">{item.title}</span>
                    </div>
                  </NavLink>
                </>
              );
            } else {
              return (
                <>
                  <Link
                    className="sidebar-link"
                    to={item.path}
                    onClick={() => handleSetShowSubnav(index)}
                  >
                    <div>
                      <span className="sidebar-label">{item.title}</span>
                    </div>
                    <div>
                      {index === showSubnav ? item.iconOpened : item.iconClosed}
                    </div>
                  </Link>
                  <div
                    className={
                      index === showSubnav ? "subnav active" : "subnav"
                    }
                  >
                    {item.subNav.map((item, index) => {
                      return (
                        <NavLink
                          activeClassName="dropdown-link-active"
                          className="dropdown-link"
                          to={item.path}
                          key={index}
                          onClick={() => setSidebar(false)}
                        >
                          <span className="sidebar-label">{item.title}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </>
              );
            }
          })}
        </div>
      </nav>
      {changePassword && (
        <div className="sidebar-change-password">
          <div>
            <div
              className="sidebar-change-password-close"
              onClick={() => {
                setChangePassword(false);
                setError("");
                setStatus("");
              }}
            >
              <AiIcons.AiOutlineClose />
            </div>
            <div className="sidebar-change-password-body">
              <div>Change Password</div>
              <div className="sidebar-change-password-body-row">
                <div>Old Password</div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter your old password"
                    onChange={(e) => {
                      setOldPass(e.target.value);
                      setError("");
                      setStatus("");
                    }}
                  />
                </div>
              </div>
              <div className="sidebar-change-password-body-row">
                <div>New Password</div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    onChange={(e) => {
                      setNewPass(e.target.value);
                      setError("");
                      setStatus("");
                    }}
                  />
                </div>
              </div>
              <div className="sidebar-change-password-body-row">
                <div>Confirm New Password</div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter your password again"
                    onChange={(e) => {
                      setConfirmPass(e.target.value);
                      setError("");
                      setStatus("");
                    }}
                  />
                </div>
                <div
                  className={
                    error != ""
                      ? "sidebar-change-password-error"
                      : "sidebar-change-password-status"
                  }
                >
                  {error}
                  {status}
                </div>
              </div>
              <div className="sidebar-change-password-action">
                <button
                  onClick={() => {
                    setChangePassword(false);
                    setError("");
                    setStatus("");
                  }}
                >
                  Cancel
                </button>
                <button onClick={handleSubmitChangePass}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );*/
}

export default Sidebar;
