import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon } from "semantic-ui-react";

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
    const { orderbookData } = this.props;
    let divClass = this.props.selectedExchange === "Coinbit" ? "hidden" : "";
    return (
      <div className={`${divClass} bidask content-wrapper`}>
        <div className="content-header" onClick={this.handleClick}>
          현재 매수/매도 갭
          {this.state.isHidden ? (
            <Icon name="triangle up" />
          ) : (
            <Icon name="triangle down" />
          )}
        </div>
        <div className={this.state.isHidden ? "content hidden" : "content"}>
          <div className="best-offer">
            <p className="price">{`최고 매수 호가 = ${
              orderbookData ? orderbookData.bidAsk.highestBidPrice : 0
            }`}</p>
            <p className="amount">{`잔량 ${
              orderbookData ? orderbookData.bidAsk.highestBidQuantity : 0
            }`}</p>
          </div>
          <div className="best-offer">
            <p className="price">{`최저 매도 호가 = ${
              orderbookData ? orderbookData.bidAsk.lowestAskPrice : 0
            }`}</p>
            <p className="amount">{`잔량 ${
              orderbookData ? orderbookData.bidAsk.lowestAskQuantity : 0
            }`}</p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    orderbookData: state.exchange.orderbookData,
    selectedExchange: state.exchange.selectedExchange
  };
};

export default connect(mapStateToProps)(BidAsk);
