import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Dimmer, Loader } from "semantic-ui-react";

import { formatNumber, toSecondDecimalPoint } from "../helper";

class Orderbook extends Component {
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
    const {
      orderbookData,
      tradesData,
      selectedExchange,
      isSearching
    } = this.props;
    let ask = orderbookData ? orderbookData.aggOrders.aggAsks : 1;
    let bid = orderbookData ? orderbookData.aggOrders.aggBids : 1;

    let totalOrders = ask + bid;
    let bidWidth = { width: `${Math.round((bid / totalOrders) * 100)}%` };
    let askWidth = { width: `${Math.round((ask / totalOrders) * 100)}%` };
    let divClass = this.props.selectedExchange === "Coinbit" ? "hidden" : "";

    let askTrades = tradesData ? tradesData.aggAsks : 1;
    let bidTrades = tradesData ? tradesData.aggBids : 1;
    let totalTrades = askTrades + bidTrades;
    let askTradesWidth = {
      width: `${Math.round((askTrades / totalTrades) * 100)}%`
    };
    let bidTradesWidth = {
      width: `${Math.round((bidTrades / totalTrades) * 100)}%`
    };
    let content =
      orderbookData.isFetching || tradesData.isFetching || isSearching ? (
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
          <h4>최근 100개 체결내역 비율</h4>
          <div className="orderbook-chart">
            <div className="bars">
              <div className="bid bar" style={bidTradesWidth} />
              <div className="ask bar" style={askTradesWidth} />
            </div>
            <div className="numbers">
              <div>{`매수 ₩${
                bidTrades ? formatNumber(toSecondDecimalPoint(bidTrades)) : 0
              }`}</div>
              <div>{`₩${
                askTrades ? formatNumber(toSecondDecimalPoint(askTrades)) : 0
              } 매도`}</div>
            </div>
          </div>
          <h4>현재 호가 비율</h4>
          <div className="orderbook-chart">
            <div className="bars">
              <div className="bid bar" style={bidWidth} />
              <div className="ask bar" style={askWidth} />
            </div>
            <div className="numbers">
              <div>{`매수 ${
                bid ? formatNumber(toSecondDecimalPoint(bid)) : 0
              }`}</div>
              <div>{`${
                ask ? formatNumber(toSecondDecimalPoint(ask)) : 0
              } 매도`}</div>
            </div>
          </div>
        </div>
      );
    return (
      <div className={`${divClass} orderbook content-wrapper`}>
        <div className="content-header" onClick={this.handleClick}>
          매수/매도 비율
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
    orderbookData: state.exchange.orderbookData,
    tradesData: state.exchange.tradesData,
    selectedExchange: state.exchange.selectedExchange,
    isSearching: state.coin.isSearching
  };
};

export default connect(mapStateToProps)(Orderbook);
