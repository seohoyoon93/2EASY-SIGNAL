import React, { Component } from "react";
import { Icon } from "semantic-ui-react";

import BarChart from "./BarChart";

class Volume extends Component {
  constructor(props) {
    super(props);
    this.state = { isHidden: false };

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState(state => ({
      isHidden: !state.isHidden
    }));
  }
  render() {
    return (
      <div className="volume content-wrapper">
        <div className="content-header" onClick={this.handleClick}>
          거래량 등락률
          {this.state.isHidden ? (
            <Icon name="triangle up" />
          ) : (
            <Icon name="triangle down" />
          )}
        </div>
        <div className={this.state.isHidden ? "content hidden" : "content"}>
          <h4>24H 거래대금</h4>
          <p>₩1,242,500</p>
          <div className="charts">
            <div className="chart">
              <div className="percent">25%</div>
              <div className="bar-wrapper">
                <BarChart options={25} />
              </div>
              <div className="time">1분</div>
            </div>
            <div className="chart">
              <div className="percent">-35%</div>
              <div className="bar-wrapper">
                <BarChart options={-35} />
              </div>
              <div className="time">3분</div>
            </div>
            <div className="chart">
              <div className="percent">35%</div>
              <div className="bar-wrapper">
                <BarChart options={35} />
              </div>
              <div className="time">5분</div>
            </div>
            <div className="chart">
              <div className="percent">50%</div>
              <div className="bar-wrapper">
                <BarChart options={50} />
              </div>
              <div className="time">15분</div>
            </div>
            <div className="chart">
              <div className="percent">50%</div>
              <div className="bar-wrapper">
                <BarChart options={50} />
              </div>
              <div className="time">30분</div>
            </div>
            <div className="chart">
              <div className="percent">90%</div>
              <div className="bar-wrapper">
                <BarChart options={90} />
              </div>
              <div className="time">1시간</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Volume;
