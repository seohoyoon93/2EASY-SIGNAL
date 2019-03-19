import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import BarChart from "./BarChart";
import { compareTime } from "../helper/helper";

class Price extends Component {
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
    const { exchangeData } = this.props;
    exchangeData.sort(compareTime);
    const oneMinuteData =
      exchangeData.length > 0
        ? Math.round(
            ((exchangeData[1].price - exchangeData[0].price) /
              exchangeData[0].price) *
              100
          )
        : 0;
    const twoMinuteData =
      exchangeData.length > 0
        ? Math.round(
            ((exchangeData[3].price +
              exchangeData[2].price -
              exchangeData[1].price -
              exchangeData[0].price) /
              (exchangeData[1].price + exchangeData[0].price)) *
              100
          )
        : 0;
    return (
      <div className="price content-wrapper">
        <div className="content-header" onClick={this.handleClick}>
          시세 등락률
          {this.state.isHidden ? (
            <Icon name="triangle up" />
          ) : (
            <Icon name="triangle down" />
          )}
        </div>
        <div className={this.state.isHidden ? "content hidden" : "content"}>
          <h4>현재시세</h4>
          <p>₩1.29</p>
          <div className="charts">
            <div className="chart">
              <div className="percent">{`${oneMinuteData}%`}</div>
              <div className="bar-wrapper">
                <BarChart options={oneMinuteData} />
              </div>
              <div className="time">1분</div>
            </div>
            <div className="chart">
              <div className="percent">{`${twoMinuteData}%`}</div>
              <div className="bar-wrapper">
                <BarChart options={twoMinuteData} />
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

const mapStateToProps = state => {
  return {
    exchangeData: state.exchange.exchangeData
  };
};

export default connect(mapStateToProps)(Price);
