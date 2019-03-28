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

  async componentDidMount() {
    const db = firebase.firestore();

    const coinsPromise = new Promise((resolve, reject) => {
      let coinObj = {};
      db.collection("coins")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const id = doc.id;
            const nameEn = doc.data().nameEn;
            const nameKo = doc.data().nameKo;
            const symbol = doc.data().symbol;

            coinObj[symbol] = { id, nameEn, nameKo, symbol };
          });
          resolve(coinObj);
        })
        .catch(err => {
          reject(err);
        });
    });
    const mentionsPromise = new Promise((resolve, reject) => {
      db.collection("mentions")
        .orderBy("timestamp", "desc")
        .get()
        .then(querySnapshot => {
          let latestMention = querySnapshot.docs[0];
          resolve(latestMention.data());
        })
        .catch(err => {
          reject(err);
        });
    });
    const values = await Promise.all([coinsPromise, mentionsPromise]);
    const coins = await mapMentionToCoin(values);
    const coinOptions = await sortByMentions(coins);
    const topMentionedCoin = coinOptions[0];
    await this.setState(
      { sym: topMentionedCoin.symbol, coinOptions: coinOptions },
      () => {
        this.props.selectCoin(this.state.sym);
      }
    );
  }

  onBlurFollower = (e, data) => {
    if (this.state.sym === "") {
      const firstCoin = this.state.coinOptions[0];
      const symbol = firstCoin.symbol;
      this.setState({ sym: symbol }, () => {
        this.props.selectCoin(this.state.sym);
      });
    }
  };

  onChangeFollower = (e, data) => {
    if (e.target.innerText) {
      const symbol = e.target.innerText
        .match(/\([A-Z]\w+\)/)[0]
        .match(/[A-Z]\w+/)[0];
      this.setState({ sym: symbol }, () => {
        this.props.selectCoin(this.state.sym);
      });
    }
  };

  render() {
    const coinOptions = this.state.coinOptions.map(coin => {
      return {
        key: coin.id,
        value: coin.symbol,
        text: `${coin.nameEn}(${coin.symbol}) 。 최근 커뮤니티 언급비율: ${
          coin.mentionPercentage
        }% (${coin.mentions}회)`
      };
    });
    return coinOptions[0] ? (
      <Dropdown
        fluid
        search
        selection
        className="coins"
        defaultValue={coinOptions[0].key}
        options={coinOptions}
        onChange={this.onChangeFollower}
        onBlur={this.onBlurFollower}
      />
    ) : (
      <div>Loading...</div>
    );
  }
}

const sortByMentions = obj => {
  let list = Object.keys(obj).map(key => {
    return obj[key];
  });
  list.sort((a, b) => {
    if (a.mentions === b.mentions) {
      let symbolA = a.symbol;
      let symbolB = b.symbol;
      if (symbolA < symbolB) {
        return -1;
      } else if (symbolA > symbolB) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return b.mentions - a.mentions;
    }
  });
  return list;
};

const mapMentionToCoin = values => {
  const coinObj = values[0];
  const mentionObj = values[1];
  const totalMentions = Object.values(mentionObj.mentions)
    .map(value => value)
    .reduce((acc, cur) => acc + cur);

  const coins = Object.keys(coinObj).map(coin => {
    const ratio = ((mentionObj.mentions[coin] / totalMentions) * 100).toFixed(
      1
    );
    return {
      id: coinObj[coin].id,
      nameEn: coinObj[coin].nameEn,
      nameKo: coinObj[coin].nameKo,
      symbol: coinObj[coin].symbol,
      mentions: mentionObj.mentions[coin],
      mentionPercentage: ratio
    };
  });
  return coins;
};

const mapDispatchToProps = dispatch => {
  return {
    selectCoin: coin => dispatch(selectCoin(coin))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Coins);
