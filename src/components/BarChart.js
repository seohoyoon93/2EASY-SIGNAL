import React from "react";
import { formatNumber, toSecondDecimalPoint } from "../helper";

const BarChart = props => {
  const { percent, isPrice, text, maxValue } = props;
  let divStyle;
  let isUp;
  let sign = percent > 0 ? "+" : "";
  let height = isPrice
    ? maxValue > 30
      ? `${(Math.abs(percent) / maxValue) * 100}%`
      : `${(Math.abs(percent) / 30) * 100}%`
    : maxValue > 100
    ? `${(Math.abs(percent) / maxValue) * 100}%`
    : `${Math.abs(percent)}%`;
  if (percent >= 0) {
    isUp = "up";
    divStyle = { height: height, minHeight: "11px" };
  } else {
    isUp = "down";
    divStyle = { height: height, minHeight: "11px" };
  }
  const priceClass = isPrice ? "price" : "";
  return (
    <div className={`chart ${priceClass}`}>
      <div className={`percent ${isUp}`}>{`${sign}${formatNumber(
        toSecondDecimalPoint(percent)
      )}%`}</div>
      <div className={`bar-wrapper ${priceClass}`}>
        <div
          className={`bar-chart ${percent.toFixed(2)} ${isUp}`}
          style={divStyle}
        />
      </div>
      <div className="time">{text}</div>
    </div>
  );
};

export default BarChart;
