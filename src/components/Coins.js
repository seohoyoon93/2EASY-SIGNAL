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
      nameKo: "",
      text: "",
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
      {
        sym: topMentionedCoin.symbol,
        nameKo: topMentionedCoin.nameKo,
        text: `${topMentionedCoin.nameKo} (${
          topMentionedCoin.symbol
        }) 。 커뮤니티 언급비율 ${topMentionedCoin.mentionPercentage}% (${
          topMentionedCoin.mentions
        }회)`,
        coinOptions: coinOptions
      },
      () => {
        this.props.selectCoin({
          symbol: this.state.sym,
          nameKo: this.state.nameKo
        });
      }
    );
  }

  onBlurFollower = (e, data) => {
    if (this.state.sym === "") {
      const firstCoin = this.state.coinOptions[0];
      const symbol = firstCoin.symbol;
      const nameKo = firstCoin.nameKo;
      const text = `${firstCoin.nameKo} (${
        firstCoin.symbol
      }) 。 커뮤니티 언급비율 ${firstCoin.mentionPercentage}% (${
        firstCoin.mentions
      }회)`;
      this.setState({ sym: symbol, nameKo: nameKo, text: text }, () => {
        this.props.selectCoin({
          symbol: this.state.sym,
          nameKo: this.state.nameKo
        });
      });
    }
  };

  onChangeFollower = (e, data) => {
    const selectedOne = this.state.coinOptions.find(elem => {
      return elem.symbol === data.value;
    });
    const text = `${selectedOne.nameKo} (${
      selectedOne.symbol
    }) 。 커뮤니티 언급비율 ${selectedOne.mentionPercentage}% (${
      selectedOne.mentions
    }회)`;
    if (e.target.innerText) {
      const symbol = e.target.innerText
        .match(/\([A-Z]\)|\([A-Z]\w+\)/)[0]
        .match(/[A-Z]\w+|[A-Z]/)[0];
      const nameKo = e.target.innerText
        .match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+\s\(/)[0]
        .match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/)[0];
      this.setState({ sym: symbol, nameKo: nameKo, text: text }, () => {
        this.props.selectCoin({
          symbol: this.state.sym,
          nameKo: this.state.nameKo
        });
      });
    }
  };

  render() {
    const coinOptions = this.state.coinOptions.map(coin => {
      return {
        key: coin.id,
        value: coin.symbol,
        text: `${coin.nameKo} (${coin.symbol}) 。 커뮤니티 언급비율 ${
          coin.mentionPercentage
        }% (${coin.mentions}회)`
      };
    });
    return this.props.isFetching ? (
      <Dropdown
        fluid
        search
        selection
        options={coinOptions}
        className="coins"
        loading
      />
    ) : (
      <Dropdown
        fluid
        search
        selection
        className="coins"
        text={this.state.text}
        defaultValue={coinOptions[0].key}
        options={coinOptions}
        onChange={this.onChangeFollower}
        onBlur={this.onBlurFollower}
      />
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

const mapStateToProps = state => {
  return {
    isFetching: state.coin.isFetching
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
