import React, { Component } from "react";
import { connect } from "react-redux";
import { selectExchange } from "../store/actions/exchangeActions";

import ExchangeList from "./ExchangeList";

class Exchanges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedExchange: ""
    };

    this.handleClick = this.handleClick.bind(this);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedCoin !== this.props.selectedCoin) {
      this.props.selectExchange(this.props.exchanges[0].name);
    }
  }
  handleClick(e, data) {
    this.setState(
      {
        selectedExchange: data.content
      },
      () => {
        this.props.selectExchange(this.state.selectedExchange);
      }
    );
  }

  render() {
    const { exchanges, selectedExchange } = this.props;
    return (
      <div className="exchanges">
        <ExchangeList
          exchanges={exchanges}
          selectedExchange={selectedExchange}
          handleClick={this.handleClick}
        />
        <div className="exchanges-lower-section">
          <img src="/images/icon_announcement.svg" alt="announcement" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedExchange: state.exchange.selectedExchange,
    exchanges: state.coin.exchanges,
    selectedCoin: state.coin.selectedCoin
  };
};

const mapDispatch = dispatch => {
  return {
    selectExchange: exchange => dispatch(selectExchange(exchange))
  };
};

export default connect(
  mapStateToProps,
  mapDispatch
)(Exchanges);
