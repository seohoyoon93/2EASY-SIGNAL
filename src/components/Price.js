import React, { Component } from "react";
import { Icon, Dimmer, Loader } from "semantic-ui-react";
import { connect } from "react-redux";

import BarChart from "./BarChart";
import { formatNumber, toSecondDecimalPoint } from "../helper";

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
    const { candleData, selectedExchange } = this.props;
    const priceChange = formatNumber(
      toSecondDecimalPoint(candleData.priceChanges.priceChange)
    );
    const priceChangeText =
      priceChange > 0
        ? `+${priceChange}%`
        : priceChange === 0
        ? `${priceChange}%`
        : `${priceChange}%`;
    const priceDivClass = priceChange >= 0 ? "up" : "down";
    const priceChanges = [
      candleData.priceChanges.minPriceChange,
      candleData.priceChanges.threeMinPriceChange,
      candleData.priceChanges.fiveMinPriceChange,
      candleData.priceChanges.fifteenMinPriceChange,
      candleData.priceChanges.thirtyMinPriceChange,
      candleData.priceChanges.hourPriceChange
    ];
    const maxValue = Math.max(...priceChanges);

    let loadingContent =
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
      );

    let charts =
      selectedExchange === "Upbit" || selectedExchange === "Bithumb" ? (
        <div className="charts">
          <BarChart
            percent={candleData.priceChanges.fiveMinPriceChange}
            isPrice={true}
            text={"5분"}
            maxValue={maxValue}
          />
          <BarChart
            percent={candleData.priceChanges.fifteenMinPriceChange}
            isPrice={true}
            text={"15분"}
            maxValue={maxValue}
          />
          <BarChart
            percent={candleData.priceChanges.thirtyMinPriceChange}
            isPrice={true}
            text={"30분"}
            maxValue={maxValue}
          />
          <BarChart
            percent={candleData.priceChanges.hourPriceChange}
            isPrice={true}
            text={"1시간"}
            maxValue={maxValue}
          />
          <BarChart
            percent={candleData.priceChanges.fourHourPriceChange}
            isPrice={true}
            text={"4시간"}
            maxValue={maxValue}
          />
          <BarChart
            percent={candleData.priceChanges.dayPriceChange}
            isPrice={true}
            text={"1일"}
            maxValue={maxValue}
          />
        </div>
      ) : (
        <div className="charts">
          <BarChart
            percent={candleData.priceChanges.minPriceChange}
            isPrice={true}
            text={"1분"}
            maxValue={maxValue}
          />
          <BarChart
            percent={candleData.priceChanges.threeMinPriceChange}
            isPrice={true}
            text={"3분"}
            maxValue={maxValue}
          />
          <BarChart
            percent={candleData.priceChanges.fiveMinPriceChange}
            isPrice={true}
            text={"5분"}
            maxValue={maxValue}
          />
          <BarChart
            percent={candleData.priceChanges.fifteenMinPriceChange}
            isPrice={true}
            text={"15분"}
            maxValue={maxValue}
          />
          <BarChart
            percent={candleData.priceChanges.thirtyMinPriceChange}
            isPrice={true}
            text={"30분"}
            maxValue={maxValue}
          />
          <BarChart
            percent={candleData.priceChanges.hourPriceChange}
            isPrice={true}
            text={"1시간"}
            maxValue={maxValue}
          />
        </div>
      );

    let content = candleData.isFetching ? (
      loadingContent
    ) : (
      <div>
        {selectedExchange === "Coinbit" ? (
          <div className="price-info">
            <div>
              <h4>현재시세</h4>
              <p>{`₩${formatNumber(candleData.priceChanges.currentPrice)}`}</p>
            </div>
          </div>
        ) : (
          <div className="price-info">
            <div>
              <h4>전일대비</h4>
              <p className={priceDivClass}>{priceChangeText}</p>
            </div>
            <div>
              <h4>현재시세</h4>
              <p>{`₩${formatNumber(candleData.priceChanges.currentPrice)}`}</p>
            </div>
          </div>
        )}
        {charts}
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
    selectedExchange: state.exchange.selectedExchange
  };
};

export default connect(mapStateToProps)(Price);
