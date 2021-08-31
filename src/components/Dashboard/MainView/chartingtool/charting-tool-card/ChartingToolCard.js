import React from "react";
import "./ChartingToolCard.css";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { useState } from "react";
export default function ChartingToolCard(props) {
  return (
    <div className="charting-tool-card">
      <header>
        <div
          onClick={() => {
            props.handleChooseCard(props.item);
          }}
        >
          <FaIcons.FaRegChartBar className="chart-icon" />
        </div>
        <div
          onClick={() => {
            props.handleChooseCard(props.item);
          }}
        >
          {props.name}
        </div>
        <div
          onClick={() => {
            props.handleDelete(props.item);
          }}
        >
          <AiIcons.AiOutlineClose className="close-icon" />
        </div>
      </header>
      <section
        onClick={() => {
          props.handleChooseCard(props.item);
        }}
      >
        {props.description}
      </section>
    </div>
  );
}
