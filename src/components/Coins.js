import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";
import { selectCoin } from "../store/actions/coinActions";
import firebase from "../config/fbConfig";

class Coins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sym: "",
      coinOptions: []
    };
  }

  componentDidMount() {
    const db = firebase.firestore();

    db.collection("Coins")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const newCoinOptions = this.state.coinOptions;
          const coin = {
            id: doc.id,
            name: doc.data().name,
            symbol: doc.data().symbol
          };

          newCoinOptions.push(coin);
          this.setState({ coinOptions: newCoinOptions });
        });
      });
  }

  onBlurFollower = (e, data) => {
    if (this.state.sym === "") {
      const firstCoin = this.state.coinOptions[0];
      const symbol = firstCoin.symbol;
      console.log(symbol);
      this.setState({ sym: symbol }, () => {
        this.props.selectCoin(this.state);
      });
    }
  };

  onChangeFollower = (e, data) => {
    if (e.target.innerText) {
      const symbol = e.target.innerText
        .match(/\([A-Z]\w+\)/)[0]
        .match(/[A-Z]\w+/)[0];
      console.log(symbol);
      this.setState({ sym: symbol }, () => {
        this.props.selectCoin(this.state);
      });
    }
  };

  render() {
    const coinOptions = this.state.coinOptions.map(coin => {
      return { key: coin.id, value: coin.symbol, text: coin.name };
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
        onBlur={this.onBlurFollower}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectCoin: coin => dispatch(selectCoin(coin))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Coins);
