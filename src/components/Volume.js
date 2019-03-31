import React, { Component } from "react";
import { Icon, Dimmer, Loader } from "semantic-ui-react";
import { connect } from "react-redux";

import BarChart from "./BarChart";
import { formatNumber, toSecondDecimalPoint } from "../helper";

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
    const { candleData, selectedExchange, isSearching } = this.props;
    const volumes = [
      candleData.volumeChanges.minVolumeChange,
      candleData.volumeChanges.threeMinVolumeChange,
      candleData.volumeChanges.fiveMinVolumeChange,
      candleData.volumeChanges.fifteenMinVolumeChange,
      candleData.volumeChanges.thirtyMinVolumeChange,
      candleData.volumeChanges.hourVolumeChange
    ].map(value => Math.abs(value));
    const maxValue = Math.max(...volumes);
    const loadingContent =
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
    let tradeVolContent =
      selectedExchange === "Coinbit" ? (
        <div />
      ) : (
        <div>
          <h4>24H 거래대금</h4>
          <p>{`₩${formatNumber(
            Math.floor(candleData.volumeChanges.accTradeVol24h)
          )}`}</p>
        </div>
      );

    let charts =
      selectedExchange === "Upbit" || selectedExchange === "Bithumb" ? (
        <div className="charts">
          <BarChart
            percent={candleData.volumeChanges.fiveMinVolumeChange}
            isPrice={false}
            maxValue={maxValue}
            text={"5분"}
          />
          <BarChart
            percent={candleData.volumeChanges.fifteenMinVolumeChange}
            isPrice={false}
            maxValue={maxValue}
            text={"15분"}
          />
          <BarChart
            percent={candleData.volumeChanges.thirtyMinVolumeChange}
            isPrice={false}
            maxValue={maxValue}
            text={"30분"}
          />
          <BarChart
            percent={candleData.volumeChanges.hourVolumeChange}
            isPrice={false}
            maxValue={maxValue}
            text={"1시간"}
          />
          <BarChart
            percent={candleData.volumeChanges.fourHourVolumeChange}
            isPrice={false}
            maxValue={maxValue}
            text={"4시간"}
          />
          <BarChart
            percent={candleData.volumeChanges.dayVolumeChange}
            isPrice={false}
            maxValue={maxValue}
            text={"1일"}
          />
        </div>
      ) : (
        <div className="charts">
          <BarChart
            percent={candleData.volumeChanges.minVolumeChange}
            isPrice={false}
            maxValue={maxValue}
            text={"1분"}
          />
          <BarChart
            percent={candleData.volumeChanges.threeMinVolumeChange}
            isPrice={false}
            maxValue={maxValue}
            text={"3분"}
          />
          <BarChart
            percent={candleData.volumeChanges.fiveMinVolumeChange}
            isPrice={false}
            maxValue={maxValue}
            text={"5분"}
          />
          <BarChart
            percent={candleData.volumeChanges.fifteenMinVolumeChange}
            isPrice={false}
            maxValue={maxValue}
            text={"15분"}
          />
          <BarChart
            percent={candleData.volumeChanges.thirtyMinVolumeChange}
            isPrice={false}
            maxValue={maxValue}
            text={"30분"}
          />
          <BarChart
            percent={candleData.volumeChanges.hourVolumeChange}
            isPrice={false}
            maxValue={maxValue}
            text={"1시간"}
          />
        </div>
      );

    let content =
      candleData.isFetching || isSearching ? (
        loadingContent
      ) : (
        <div>
          {tradeVolContent}
          {charts}
        </div>
      );
    return (
      <div className="volume content-wrapper">
        <div className="content-header" onClick={this.handleClick}>
          거래량 등락률
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

export default connect(mapStateToProps)(Volume);
