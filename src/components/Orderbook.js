import React, { Component } from "react";
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
    let bidWidth = { width: "33%" };
    let askWidth = { width: "67%" };
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
          <p>1 : 2</p>
          <div className="orderbook-chart">
            <div className="bars">
              <div className="bid bar" style={bidWidth}>
                2,300
              </div>
              <div className="ask bar" style={askWidth}>
                4,600
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Orderbook;
