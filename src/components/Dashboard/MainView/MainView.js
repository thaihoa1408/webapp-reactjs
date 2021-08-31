import React, { useState } from "react";
import "./MainView.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { getSiteid } from "../../Utils/Common";
import SiteView from "./SiteView/SiteView";
import SiteKpi from "./sitekpi/SiteKpi";
import DeviceList from "./devicelist/DeviceList";
import ManageAccount from "./manage-account/ManageAccount";
import FleetView from "./fleetview/FleetView";
import SiteList from "./sitelist/SiteList";
import LeaderBoard from "./leaderboard/LeaderBoard";
import ChartingTool from "./chartingtool/ChartingTool";
import Availability from "./availability/Availability";
import TopologyAnalysis from "./topology-analysis/TopologyAnalysis";
import BudgetIrradiationInput from "./budget-irradiation-input/BudgetIrradiationInput";
import BudgetProductionInput from "./budget-production-input/BudgetProductionInput";
import DataExport from "./dataexport/DataExport";
import SiteManagement from "./manage-site/SiteManagement";
import DatatypeEditor from "./datatype-editor/DatatypeEditor";
export default function MainView(props) {
  return (
    <div className="mainview-container">
      <Switch>
        <Route path="/dashboard/site-monitor/siteview/:id">
          <SiteView handleSetSiteid={props.handleSetSiteid} />
        </Route>
        <Route path="/dashboard/site-monitor/sitekpi/:id">
          <SiteKpi handleSetSiteid={props.handleSetSiteid} />/
        </Route>
        <Route path="/dashboard/site-monitor/devicelist/:id">
          <DeviceList handleSetSiteid={props.handleSetSiteid} />
        </Route>
        <Route path="/dashboard/manage_account" component={ManageAccount} />
        <Route path="/dashboard/central-monitor/fleetview/:id">
          <FleetView handleSetSiteid={props.handleSetSiteid} />
        </Route>
        <Route path="/dashboard/central-monitor/sitelist">
          <SiteList handleSetSiteid={props.handleSetSiteid} />
        </Route>
        <Route
          path="/dashboard/central-monitor/leaderboard"
          component={LeaderBoard}
        />
        <Route path="/dashboard/analyse/chartingtool/:id">
          <ChartingTool handleSetSiteid={props.handleSetSiteid} />
        </Route>
        <Route path="/dashboard/analyse/availability/:id">
          <Availability handleSetSiteid={props.handleSetSiteid} />
        </Route>
        <Route path="/dashboard/analyse/topologyanalysis/:id">
          <TopologyAnalysis handleSetSiteid={props.handleSetSiteid} />
        </Route>
        <Route path="/dashboard/site-management/budgetproductioninput/:id">
          <BudgetProductionInput handleSetSiteid={props.handleSetSiteid} />
        </Route>
        <Route path="/dashboard/site-management/budgetinsolationinput/:id">
          <BudgetIrradiationInput handleSetSiteid={props.handleSetSiteid} />
        </Route>
        <Route path="/dashboard/data-report/dataexport/:id">
          <DataExport handleSetSiteid={props.handleSetSiteid} />
        </Route>
        <Route path="/dashboard/site_management" component={SiteManagement} />
        <Route path="/dashboard/datatype_editor" component={DatatypeEditor} />
      </Switch>
    </div>
  );
}
