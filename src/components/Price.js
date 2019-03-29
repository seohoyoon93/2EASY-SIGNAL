import React, { Component } from "react";
import { Icon, Dimmer, Loader } from "semantic-ui-react";
import { connect } from "react-redux";

import BarChart from "./BarChart";

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
    const { candleData } = this.props;
    let content = candleData.isFetching ? (
      <Dimmer active inverted>
        <Loader inverted>Loading...</Loader>
      </Dimmer>
    ) : (
      <div>
        <h4>현재시세</h4>
        <p>{`₩${candleData.priceChanges.currentPrice}`}</p>
        <div className="charts">
          <div className="chart">
            <div className="percent">{`${
              candleData.priceChanges.minPriceChange
            }%`}</div>
            <div className="bar-wrapper">
              <BarChart options={candleData.priceChanges.minPriceChange} />
            </div>
            <div className="time">1분</div>
          </div>
          <div className="chart">
            <div className="percent">{`${
              candleData.priceChanges.threeMinPriceChange
            }%`}</div>
            <div className="bar-wrapper">
              <BarChart options={candleData.priceChanges.threeMinPriceChange} />
            </div>
            <div className="time">3분</div>
          </div>
          <div className="chart">
            <div className="percent">{`${
              candleData.priceChanges.fiveMinPriceChange
            }%`}</div>
            <div className="bar-wrapper">
              <BarChart options={candleData.priceChanges.fiveMinPriceChange} />
            </div>
            <div className="time">5분</div>
          </div>
          <div className="chart">
            <div className="percent">{`${
              candleData.priceChanges.fifteenMinPriceChange
            }%`}</div>
            <div className="bar-wrapper">
              <BarChart
                options={candleData.priceChanges.fifteenMinPriceChange}
              />
            </div>
            <div className="time">15분</div>
          </div>
          <div className="chart">
            <div className="percent">{`${
              candleData.priceChanges.thirtyMinPriceChange
            }%`}</div>
            <div className="bar-wrapper">
              <BarChart
                options={candleData.priceChanges.thirtyMinPriceChange}
              />
            </div>
            <div className="time">30분</div>
          </div>
          <div className="chart">
            <div className="percent">{`${
              candleData.priceChanges.hourPriceChange
            }%`}</div>
            <div className="bar-wrapper">
              <BarChart options={candleData.priceChanges.hourPriceChange} />
            </div>
            <div className="time">1시간</div>
          </div>
        </div>
      </div>
    );
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
          {content}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    candleData: state.exchange.candleData
  };
};

export default connect(mapStateToProps)(Price);
