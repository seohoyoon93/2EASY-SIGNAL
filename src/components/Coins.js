import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";
import { selectCoin } from "../store/actions/coinActions";

class Coins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sym: ""
    };
  }
  onChangeFollower = (e, data) => {
    const symbol = e.target.innerText
      .match(/\([A-Z]\w+\)/)[0]
      .match(/[A-Z]\w+/)[0];
    console.log(symbol);
    this.setState({ sym: symbol }, () => {
      this.props.selectCoin(this.state);
    });
  };

  render() {
    const { coins } = this.props;
    const coinOptions = coins.map(coin => {
      return { key: coin.id, value: coin.sym, text: coin.name };
    });
    return (
      <Dropdown
        placeholder="코인을 선택하세요"
        fluid
        search
        selection
        className="coins"
        options={coinOptions}
        onChange={this.onChangeFollower}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    coins: state.coin.coins
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectCoin: coin => dispatch(selectCoin(coin))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Coins);
