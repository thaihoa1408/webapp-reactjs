import React from "react";
import "./SiteBox.css";
import img1 from "../../../../../images/download.png";
import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";
export default function SiteBox(props) {
  let history = useHistory();
  return (
    <div
      className="sitebox-container"
      onClick={() => {
        props.handleSetSiteid(props.id);
        history.push(`/dashboard/site-monitor/siteview/${props.id}`);
      }}
    >
      <div className="sitebox-header">
        <div>{props.operation_state}</div>
        <div>{props.name}</div>
      </div>
      <div className="sitebox-body">
        <div className="sitebox-body-img">
          <img src={img1} />
        </div>
        <div className="sitebox-body-infor">
          <ul>
            <li>Production: {props.production_today}kWh</li>
            <li>Irradiation: {props.irradiation}Wh/㎡</li>
            <li>Power Ratio: {props.power_ratio}%</li>
            <li>Active Power: {props.active_power}W</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
