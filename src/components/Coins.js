import React, { Component } from "react";
import { Search, Loader, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import _ from "lodash";
import { selectCoin } from "../store/actions/coinActions";
import firebase from "../config/fbConfig";

class Coins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: [],
      results: [],
      isListHidden: true,
      selectedCoin: null
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
            const price = doc.data().price;
            const priceChange = doc.data().priceChange;

            coinObj[symbol] = {
              id,
              nameEn,
              nameKo,
              symbol,
              price,
              priceChange
            };
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
    const results = await sortByMentions(coins);
    const topMentionedCoin = await results[0];
    await this.setState(
      {
        coins: coins,
        results: results,
        selectedCoin: topMentionedCoin
      },
      () => {
        this.props.selectCoin({
          symbol: this.state.selectedCoin.symbol,
          nameKo: this.state.selectedCoin.nameKo
        });
      }
    );
  }

  handleClick = (e, data) => {
    this.setState({ isListHidden: !this.state.isListHidden });
  };

  resetComponent = () => this.setState({ results: this.state.coins });

  handleSearchChange = (e, { value }) => {
    if (value.length < 1) return this.resetComponent();

    const re = new RegExp(_.escapeRegExp(value), "i");
    const isMatch = result => re.test(result.title);

    this.setState({
      isLoading: false,
      results: sortByMentions(_.filter(this.state.coins, isMatch))
    });
  };

  handleItemClick = (e, data) => {
    const selectedOne = this.state.coins.find(elem => {
      return elem.symbol === e.target.getAttribute("data-item");
    });
    this.setState({ selectedCoin: selectedOne, isListHidden: true }, () => {
      this.props.selectCoin({
        symbol: this.state.selectedCoin.symbol,
        nameKo: this.state.selectedCoin.nameKo
      });
    });
  };

  render() {
    const { results, selectedCoin } = this.state;
    const rows =
      !this.props.isFetching && selectedCoin !== null ? (
        results.map(item => {
          const priceDivClass = item.priceChange >= 0 ? "up" : "down";
          const selectedDivClass =
            item.id === selectedCoin.id ? "selected" : "";
          return (
            <li
              key={item.id}
              className={selectedDivClass}
              onClick={this.handleItemClick}
              data-item={item.symbol}
            >
              <div
                className="coin-summary__name context"
                data-item={item.symbol}
              >{`${item.nameKo} (${item.symbol})`}</div>
              <div
                className="coin-summary__mention context"
                data-item={item.symbol}
              >
                {`${item.mentionPercentage}%`}
                <p className="cell-bottom" data-item={item.symbol}>
                  {`${item.mentions}회`}
                </p>
              </div>
              <div
                className="coin-summary__price context"
                data-item={item.symbol}
              >
                <div className={priceDivClass} data-item={item.symbol}>
                  {`${item.priceChange}%`}
                  <p className="cell-bottom" data-item={item.symbol}>
                    {`₩${item.price}%`}
                  </p>
                </div>
              </div>
            </li>
          );
        })
      ) : (
        <div />
      );

    const priceDivClass =
      selectedCoin !== null
        ? selectCoin.priceChange >= 0
          ? "up"
          : "down"
        : "";
    const coinSummary =
      !this.props.isFetching && selectCoin !== null ? (
        <div className="coin-summary-content">
          <div className="coin-summary__name context bold">{`${
            selectedCoin.nameKo
          } (${selectedCoin.symbol})`}</div>
          <div className="coin-summary__mention context bold">
            {`${selectedCoin.mentionPercentage}%`}
            <div className="context-bottom mention">{`${
              selectedCoin.mentions
            }회`}</div>
          </div>
          <div className={`coin-summary__price context bold ${priceDivClass}`}>
            {`${selectedCoin.priceChange}%`}
            <div className="context-bottom bold">
              {`₩${selectedCoin.price}`}
            </div>
          </div>
        </div>
      ) : (
        <div className="coin-summary-content">
          <Loader active inline />
        </div>
      );

    const searchDivClass = this.state.isListHidden
      ? "search-coin hidden"
      : "search-coin";
    return (
      <div>
        <div className={searchDivClass}>
          <Search
            loading={this.props.isFetching}
            onSearchChange={this.handleSearchChange}
          />
          <div>
            <div>
              <div>
                <div>이름(심볼)</div>
                <div>최근 커뮤니티 언급비율</div>
                <div>전일대비/시세</div>
              </div>
            </div>
            <ul>{rows}</ul>
          </div>
        </div>
        <div className="coin-summary" onClick={this.handleClick}>
          <div className="coin-summary-header">
            <div className="coin-summary__name">이름(심볼)</div>
            <div className="coin-summary__mention">최근 커뮤니티 언급비율</div>
            <div className="coin-summary__price">전일대비/시세</div>
          </div>
          {coinSummary}
          <div className="coin-summary__icon">
            <Icon name="triangle down" />
          </div>
        </div>
      </div>
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
      title: `${coinObj[coin].nameKo} (${coinObj[coin].symbol})`,
      nameEn: coinObj[coin].nameEn,
      nameKo: coinObj[coin].nameKo,
      symbol: coinObj[coin].symbol,
      mentions: mentionObj.mentions[coin],
      mentionPercentage: ratio,
      price: coinObj[coin].price,
      priceChange: coinObj[coin].priceChange
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
