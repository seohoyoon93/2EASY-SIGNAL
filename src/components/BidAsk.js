import React, { Component } from "react";
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
    return (
      <div className="bidask content-wrapper">
        <div className="content-header" onClick={this.handleClick}>
          현재 매수/매도 갭
          {this.state.isHidden ? (
            <Icon name="triangle up" />
          ) : (
            <Icon name="triangle down" />
          )}
        </div>
        <div className={this.state.isHidden ? "content hidden" : "content"}>
          <h4>1호가 = 0.1</h4>
          <div className="best-offer">
            <p className="price">최고 매수 호가 = 35.1</p>
            <p className="amount">잔량 123.125</p>
          </div>
          <div className="best-offer">
            <p className="price">최저 매도 호가 = 39.1</p>
            <p className="amount">잔량 246.000</p>
          </div>
        </div>
      </div>
    );
  }
}

export default BidAsk;
