import React, { useEffect, useState } from "react";
import "./ProductionSiteInverter.css";
import pic1 from "./pic/pic_1.png";
import pic2 from "./pic/pic_2.png";
import pic3 from "./pic/pic_3.png";
import axios from "axios";
import config from "../../../../../config.json";
export default function ProductionSiteInverter(props) {
  let year = props.date.split("-")[0];
  let month = props.date.split("-")[1];
  let day = props.date.split("-")[2];
  const [data, setData] = useState({
    inverterProduction: null,
    siteProduction: null,
  });
  let interval;
  const [inter, setInter] = useState(true);
  useEffect(() => {
    const getData = () => {
      if (props.select[0]) {
        axios
          .get(`/siteview/productioninfor`, {
            params: {
              siteid: props.siteid,
              time: "day",
              date: year + "," + month + "," + day,
            },
          })
          .then((response) => setData(response.data));
      }
      if (props.select[1]) {
        axios
          .get(`/siteview/productioninfor`, {
            params: {
              siteid: props.siteid,
              time: "month",
              date: year + "," + month,
            },
          })
          .then((response) => setData(response.data));
      }
      if (props.select[2]) {
        axios
          .get(`/siteview/productioninfor`, {
            params: {
              siteid: props.siteid,
              time: "year",
              date: year,
            },
          })
          .then((response) => setData(response.data));
      }
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
  }, [props.siteid, inter, props.date, props.select]);
  return (
    <div className="production-site-inverter">
      <h1 className="production-site-inverter-title">Production</h1>
      <div className="production-site-inverter-body">
        <div>
          <div>
            <div>
              <div>
                <img src={pic1} />
              </div>
              <div>Inverter</div>
              <div>{data.inverterProduction} kWh</div>
            </div>
            <div></div>
            <div>
              <div>
                <img src={pic2} />
              </div>
              <div>Site</div>
              <div>{data.siteProduction} kWh</div>
            </div>
            <div></div>
            <div>
              <div>
                <img src={pic3} />
              </div>
              <div>Grid</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
