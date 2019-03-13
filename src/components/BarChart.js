import React from "react";

const BarChart = props => {
  const percent = props.options;
  let divStyle;
  let isUp;
  if (percent >= 0) {
    isUp = "up";
    divStyle = { height: `${percent}%` };
  } else {
    isUp = "down";
    divStyle = { height: `${0 - percent}%` };
  }
  return <div className={`bar-chart ${percent} ${isUp}`} style={divStyle} />;
};

export default BarChart;
