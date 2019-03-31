import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Dimmer, Loader } from "semantic-ui-react";

import { formatNumber, toSecondDecimalPoint } from "../helper";

class BidAsk extends Component {
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
    const { orderbookData, selectedExchange, isSearching } = this.props;
    let divClass = selectedExchange === "Coinbit" ? "hidden" : "";
    let content =
      orderbookData.isFetching || isSearching ? (
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
          <div className="best-offer">
            <h4 className="price bid">{`최고 매수 호가 = ${
              orderbookData
                ? formatNumber(orderbookData.bidAsk.highestBidPrice)
                : 0
            }`}</h4>
            <p className="amount">{`잔량 ${
              orderbookData
                ? formatNumber(
                    toSecondDecimalPoint(
                      orderbookData.bidAsk.highestBidQuantity
                    )
                  )
                : 0
            }`}</p>
          </div>
          <div className="best-offer">
            <h4 className="price ask">{`최저 매도 호가 = ${
              orderbookData
                ? formatNumber(orderbookData.bidAsk.lowestAskPrice)
                : 0
            }`}</h4>
            <p className="amount">{`잔량 ${
              orderbookData
                ? formatNumber(
                    toSecondDecimalPoint(orderbookData.bidAsk.lowestAskQuantity)
                  )
                : 0
            }`}</p>
          </div>
        </div>
      );
    return (
      <div className={`${divClass} bidask content-wrapper`}>
        <div className="content-header" onClick={this.handleClick}>
          현재 매수/매도 갭
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
    selectedExchange: state.exchange.selectedExchange,
    isSearching: state.coin.isSearching
  };
};

export default connect(mapStateToProps)(BidAsk);
