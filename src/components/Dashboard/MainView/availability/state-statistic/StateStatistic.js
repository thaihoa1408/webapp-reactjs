import React from "react";
import "./StateStatistic.css";
import * as FaIcons from "react-icons/fa";
import * as TiIcons from "react-icons/ti";
import ReactApexChart from "react-apexcharts";
export default function StateStatistic() {
  const series = [44, 55, 41, 17, 15, 0, 0, 0, 0];
  const options = {
    chart: {
      width: 380,
      type: "donut",
    },
    labels: [
      "Full Capability",
      "Partial Capability",
      "Service Setpoint",
      "Out of Environmental Specification",
      "Low Irradiance",
      "Temperature Range",
      "Requested Shutdown",
      "Startup",
      "DC Disturbance",
    ],
    plotOptions: {
      pie: {
        dataLabels: {},
      },
    },

    legend: {
      show: true,
      labels: {
        colors: "#f1f1f1",
      },
      markers: {
        width: 20,
        height: 12,
        strokeWidth: 0,
        strokeColor: "#fff",
        fillColors: undefined,
        radius: 2,
        customHTML: undefined,
        onClick: undefined,
      },
    },
  };
  return (
    <div className="state-statistic">
      <div className="col-1">
        <div>
          <div>
            <FaIcons.FaTools />
          </div>
          <div>
            <div>
              <span>98.63%</span>
              <span>Operational</span>
            </div>
            <div>Time-based Availability</div>
          </div>
        </div>
        <div>
          <div>
            <TiIcons.TiDeviceDesktop />
          </div>
          <div>
            <div>
              <span>98.69%</span>
              <span>Technical</span>
            </div>
            <div>Time-based Availability</div>
          </div>
        </div>
        <div>
          <div>
            <FaIcons.FaUser />
          </div>
          <div>
            <div>
              <span>98.68%</span>
              <span>Customized</span>
            </div>
            <div>Time-based Availability</div>
          </div>
        </div>
      </div>
      <div className="col-2">
        <header>State Statistics</header>
        <section>
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height="80%"
            width="100%"
          />
        </section>
      </div>
    </div>
  );
}
