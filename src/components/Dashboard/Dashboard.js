import React, { useEffect, useState } from "react";
import {
  getSiteid,
  getToken,
  removeSiteid,
  removeUserSession,
  setUserSession,
} from "../Utils/Common";
import Sidebar from "./sidebar/Sidebar";
import axios from "axios";
import config from "../../config.json";
import MainView from "./MainView/MainView";
import "./Dashboard.css";
import Navbar from "./Navbar/Navbar";
function Dashboard(props) {
  const [authLoading, setAuthLoading] = useState(true);
  const [siteid, setSiteid] = useState(getSiteid());
  const handleSetSiteid = (value) => {
    setSiteid(value);
  };
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const handleSetShowSidebar = () => {
    setIsShowSidebar(!isShowSidebar);
  };
  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    axios
      .get(`/verifyToken?token=${token}`)
      .then((response) => {
        setUserSession(response.data.accessToken, response.data.user);
        setAuthLoading(false);
      })
      .catch((error) => {
        removeUserSession();
        setAuthLoading(false);
      });
  }, []);
  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>;
  }
  const handleLogout = () => {
    removeUserSession();
    removeSiteid();
    props.history.push("/");
  };
  return (
    <div className="dashboard-container">
      <Navbar
        handleLogout={handleLogout}
        handleSetShowSidebar={handleSetShowSidebar}
      />
      <div className="dashboard-body">
        <Sidebar
          siteid={siteid}
          isShowSidebar={isShowSidebar}
          handleSetShowSidebar={handleSetShowSidebar}
        />
        <MainView
          isShowSidebar={isShowSidebar}
          handleSetSiteid={handleSetSiteid}
        />
      </div>
    </div>
  );
  /*return (
    <div>
      <Router>
        <Sidebar handleLogout={handleLogout} siteid={siteid} />
        <Switch>
          <Route path="/dashboard/site-monitor/siteview/:id">
            <SiteView handleSetSiteid={handleSetSiteid} />
          </Route>
          <Route path="/dashboard/site-monitor/sitekpi/:id">
            <SiteKpi handleSetSiteid={handleSetSiteid} />/
          </Route>
          <Route path="/dashboard/site-monitor/devicelist/:id">
            <DeviceList handleSetSiteid={handleSetSiteid} />
          </Route>
          <Route path="/dashboard/manage_account" component={ManageAccount} />
          <Route path="/dashboard/central-monitor/fleetview/:id">
            <FleetView handleSetSiteid={handleSetSiteid} />
          </Route>
          <Route path="/dashboard/central-monitor/sitelist">
            <SiteList handleSetSiteid={handleSetSiteid} />
          </Route>
          <Route
            path="/dashboard/central-monitor/leaderboard"
            component={LeaderBoard}
          />
          <Route path="/dashboard/analyse/chartingtool/:id">
            <ChartingTool handleSetSiteid={handleSetSiteid} />
          </Route>
          <Route path="/dashboard/analyse/availability/:id">
            <Availability handleSetSiteid={handleSetSiteid} />
          </Route>
          <Route path="/dashboard/analyse/topologyanalysis/:id">
            <TopologyAnalysis handleSetSiteid={handleSetSiteid} />
          </Route>
          <Route path="/dashboard/site-management/budgetproductioninput/:id">
            <BudgetProductionInput handleSetSiteid={handleSetSiteid} />
          </Route>
          <Route path="/dashboard/site-management/budgetinsolationinput/:id">
            <BudgetIrradiationInput handleSetSiteid={handleSetSiteid} />
          </Route>
          <Route path="/dashboard/data-report/dataexport/:id">
            <DataExport handleSetSiteid={handleSetSiteid} />
          </Route>
          <Route path="/dashboard/site_management" component={SiteManagement} />
          <Route path="/dashboard/datatype_editor" component={DatatypeEditor} />
        </Switch>
      </Router>
    </div>
  );*/
}

export default Dashboard;
