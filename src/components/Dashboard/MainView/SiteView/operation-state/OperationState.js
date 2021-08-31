import React, { useEffect } from "react";
import "./OperationState.css";
import pic2 from "../pic/p.svg";
import { useHistory } from "react-router-dom";
import axios from "axios";
import config from "../../../../../config.json";
import { useState } from "react";
export default function OperationState(props) {
  let history = useHistory();
  const [numOfInverter, setNumOfInverter] = useState(null);
  useEffect(() => {
    const getData = async () => {
      const [firstResponse] = await Promise.all([
        axios
          .get(`/entityget?ancestor=${props.siteid}&kind=Inverter`)
          .then((response) => response.data),
      ]);
      setNumOfInverter(firstResponse.length);
    };
    getData();
  }, []);
  return (
    <div className="operation-state">
      <div className="col-1">
        <div>
          <img src={pic2} />
        </div>
        <div>
          <div>Operation State</div>
          <div>
            <div></div>
            <div>Normal</div>
          </div>
        </div>
      </div>
      <div>
        <div className="col-2">
          <div>
            <div>
              <span>Inverter ({numOfInverter})</span>
              <span
                onClick={() => {
                  history.push(
                    `/dashboard/site-monitor/devicelist/${props.siteid}`
                  );
                }}
              >
                Details
              </span>
            </div>
            <div>
              <span>Infor Not Available</span>
              <span>0</span>
              <span>Non Operative</span>
              <span>0</span>
            </div>
          </div>
        </div>
        <div className="col-3"></div>
        <div className="col-4">
          <div>
            <div>
              <span>Alarm (2)</span>
              <span>Details</span>
            </div>
            <div>
              <span>Fault</span>
              <span>0</span>
              <span>Warning</span>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
