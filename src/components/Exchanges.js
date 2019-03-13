import React, { Component } from "react";
import { connect } from "react-redux";

import ExchangeList from "./ExchangeList";

class Exchanges extends Component {
  render() {
    const { exchanges } = this.props;
    return (
      <div className="exchanges">
        <ExchangeList exchanges={exchanges} />
        <div className="exchanges-lower-section">
          <img src="/images/icon_announcement.svg" alt="announcement" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    exchanges: state.exchange.exchanges
  };
};

export default connect(mapStateToProps)(Exchanges);
