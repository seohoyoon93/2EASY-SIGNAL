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
    const { candleData, selectedExchange, isSearching } = this.props;
    const priceChange = candleData.priceChanges.priceChange;
    const priceChangeText =
      priceChange > 0
        ? `+${priceChange}%`
        : priceChange === 0
        ? `${priceChange}%`
        : `${priceChange}%`;
    const priceDivClass = priceChange >= 0 ? "up" : "down";
    let content =
      candleData.isFetching || isSearching ? (
        selectedExchange === "Bitsonic" ? (
          <Dimmer active inverted>
            <Loader inverted>
              비트소닉에서 브라우저를 확인중입니다.
              <br />
              비트소닉 로딩은 많은 시간이 소요됩니다..
            </Loader>
          </Dimmer>
        ) : selectedExchange === "Coinbit" ? (
          <Dimmer active inverted>
            <Loader inverted>
              코인빗에서 브라우저를 확인중입니다.
              <br />
              코인빗 로딩은 많은 시간이 소요됩니다..
            </Loader>
          </Dimmer>
        ) : (
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
        )
      ) : (
        <div>
          <div className="price-info">
            <div>
              <h4>전일대비</h4>
              <p className={priceDivClass}>{priceChangeText}</p>
            </div>
            <div>
              <h4>현재시세</h4>
              <p>{`₩${candleData.priceChanges.currentPrice}`}</p>
            </div>
          </div>
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
                <BarChart
                  options={candleData.priceChanges.threeMinPriceChange}
                />
              </div>
              <div className="time">3분</div>
            </div>
            <div className="chart">
              <div className="percent">{`${
                candleData.priceChanges.fiveMinPriceChange
              }%`}</div>
              <div className="bar-wrapper">
                <BarChart
                  options={candleData.priceChanges.fiveMinPriceChange}
                />
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
            <Icon name="triangle down" />
          ) : (
            <Icon name="triangle up" />
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
    candleData: state.exchange.candleData,
    selectedExchange: state.exchange.selectedExchange,
    isSearching: state.coin.isSearching
  };
};

export default connect(mapStateToProps)(Price);
