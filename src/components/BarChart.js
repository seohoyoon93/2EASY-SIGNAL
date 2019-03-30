import React from "react";

const BarChart = props => {
  const percent = props.options;
  let divStyle;
  let isUp;
  if (percent >= 0) {
    isUp = "up";
    divStyle = { height: `${percent}%`, minHeight: "11px" };
  } else {
    isUp = "down";
    divStyle = { height: `${0 - percent}%`, minHeight: "11px" };
  }
  return <div className={`bar-chart ${percent} ${isUp}`} style={divStyle} />;
};

export default BarChart;
