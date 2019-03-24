import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon } from "semantic-ui-react";

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
    const { orderbookData } = this.props;
    let ask = orderbookData ? orderbookData.aggOrders.aggAsks : 1;
    let bid = orderbookData ? orderbookData.aggOrders.aggBids : 1;

    let total = ask + bid;
    let bidWidth = { width: `${Math.round((bid / total) * 100)}%` };
    let askWidth = { width: `${Math.round((ask / total) * 100)}%` };
    return (
      <div className="orderbook content-wrapper">
        <div className="content-header" onClick={this.handleClick}>
          현재 매수/매도 비율
          {this.state.isHidden ? (
            <Icon name="triangle up" />
          ) : (
            <Icon name="triangle down" />
          )}
        </div>
        <div className={this.state.isHidden ? "content hidden" : "content"}>
          <h4>매수 : 매도</h4>
          <div className="orderbook-chart">
            <div className="bars">
              <div className="bid bar" style={bidWidth}>
                {bid}
              </div>
              <div className="ask bar" style={askWidth}>
                {ask}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    orderbookData: state.exchange.orderbookData
  };
};

export default connect(mapStateToProps)(Orderbook);
