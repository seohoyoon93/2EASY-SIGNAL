import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import BarChart from "./BarChart";
import { compareTime } from "../helper/helper";

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
    const { candleData } = this.props;
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
        {candleData.isFetching ? (
          <div>Loading</div>
        ) : (
          <div className={this.state.isHidden ? "content hidden" : "content"}>
            <h4>24H 거래대금</h4>
            <p>₩1,242,500</p>
            <div className="charts">
              <div className="chart">
                <div className="percent">{`${
                  candleData.volumeChanges.minVolumeChange
                }%`}</div>
                <div className="bar-wrapper">
                  <BarChart
                    options={candleData.volumeChanges.minVolumeChange}
                  />
                </div>
                <div className="time">1분</div>
              </div>
              <div className="chart">
                <div className="percent">{`${
                  candleData.volumeChanges.threeMinVolumeChange
                }%`}</div>
                <div className="bar-wrapper">
                  <BarChart
                    options={candleData.volumeChanges.threeMinVolumeChange}
                  />
                </div>
                <div className="time">3분</div>
              </div>
              <div className="chart">
                <div className="percent">{`${
                  candleData.volumeChanges.fiveMinVolumeChange
                }%`}</div>
                <div className="bar-wrapper">
                  <BarChart
                    options={candleData.volumeChanges.minVolumeChange}
                  />
                </div>
                <div className="time">5분</div>
              </div>
              <div className="chart">
                <div className="percent">{`${
                  candleData.volumeChanges.fifteenMinVolumeChange
                }%`}</div>
                <div className="bar-wrapper">
                  <BarChart
                    options={candleData.volumeChanges.fifteenMinVolumeChange}
                  />
                </div>
                <div className="time">15분</div>
              </div>
              <div className="chart">
                <div className="percent">{`${
                  candleData.volumeChanges.thirtyMinVolumeChange
                }%`}</div>
                <div className="bar-wrapper">
                  <BarChart
                    options={candleData.volumeChanges.thirtyMinVolumeChange}
                  />
                </div>
                <div className="time">30분</div>
              </div>
              <div className="chart">
                <div className="percent">{`${
                  candleData.volumeChanges.hourVolumeChange
                }%`}</div>
                <div className="bar-wrapper">
                  <BarChart
                    options={candleData.volumeChanges.hourVolumeChange}
                  />
                </div>
                <div className="time">1시간</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    candleData: state.exchange.candleData
  };
};

export default connect(mapStateToProps)(Volume);
