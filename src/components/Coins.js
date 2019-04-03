import React, { Component } from "react";
import { Search, Loader, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import _ from "lodash";
import { selectCoin, searchCoin } from "../store/actions/coinActions";
import firebase from "../config/fbConfig";
import { formatNumber } from "../helper";

const ASC = 1;
const DESC = -1;
const NOT_SELECTED = 0;
class Coins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: [],
      results: [],
      isListHidden: true,
      selectedCoin: null,
      nameSortOrder: NOT_SELECTED,
      mentionSortOrder: DESC,
      priceSortOrder: NOT_SELECTED
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

  resetComponent = () =>
    this.setState({ results: sortByMentions(this.state.coins) });

  handleClick = (e, data) => {
    this.setState({ isListHidden: !this.state.isListHidden }, () => {
      document.getElementsByClassName("prompt")[0].focus();
      this.props.searchCoin();
    });
  };

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

  handleCloseClick = (e, data) => {
    this.setState({ isListHidden: true });
  };

  handleSortByName = (e, data) => {
    const currentResults = this.state.results;
    let sortedResults;
    if (
      this.state.nameSortOrder === NOT_SELECTED ||
      this.state.nameSortOrder === DESC
    ) {
      sortedResults = currentResults.sort(sortByNameAsc);
      this.setState({
        results: sortedResults,
        nameSortOrder: ASC,
        mentionSortOrder: NOT_SELECTED,
        priceSortOrder: NOT_SELECTED
      });
    } else {
      sortedResults = currentResults.sort(sortByNameDesc);
      this.setState({
        results: sortedResults,
        nameSortOrder: DESC,
        mentionSortOrder: NOT_SELECTED,
        priceSortOrder: NOT_SELECTED
      });
    }
  };

  handleSortByPriceChange = (e, data) => {
    const currentResults = this.state.results;
    let sortedResults;
    if (
      this.state.priceSortOrder === NOT_SELECTED ||
      this.state.priceSortOrder === ASC
    ) {
      sortedResults = currentResults.sort(sortByPriceChangeDesc);
      this.setState({
        results: sortedResults,
        nameSortOrder: NOT_SELECTED,
        mentionSortOrder: NOT_SELECTED,
        priceSortOrder: DESC
      });
    } else {
      sortedResults = currentResults.sort(sortByPriceChangeAsc);
      this.setState({
        results: sortedResults,
        nameSortOrder: NOT_SELECTED,
        mentionSortOrder: NOT_SELECTED,
        priceSortOrder: ASC
      });
    }
  };

  handleSortByMentions = (e, data) => {
    const currentResults = this.state.results;
    let sortedResults;
    if (
      this.state.mentionSortOrder === NOT_SELECTED ||
      this.state.mentionSortOrder === ASC
    ) {
      sortedResults = currentResults.sort(sortListByMentionsDesc);
      this.setState({
        results: sortedResults,
        nameSortOrder: NOT_SELECTED,
        mentionSortOrder: DESC,
        priceSortOrder: NOT_SELECTED
      });
    } else {
      sortedResults = currentResults.sort(sortListByMentionsAsc);
      this.setState({
        results: sortedResults,
        nameSortOrder: NOT_SELECTED,
        mentionSortOrder: ASC,
        priceSortOrder: NOT_SELECTED
      });
    }
  };

  render() {
    const {
      results,
      selectedCoin,
      nameSortOrder,
      mentionSortOrder,
      priceSortOrder
    } = this.state;
    const rows =
      !this.props.isFetching && selectedCoin !== null ? (
        results.map(item => {
          const priceDivClass = item.priceChange >= 0 ? "up" : "down";
          const sign = item.priceChange > 0 ? "+" : "";
          const selectedDivClass =
            item.id === selectedCoin.id
              ? "coin-summary-content selected"
              : "coin-summary-content";
          return (
            <li
              key={item.id}
              className={selectedDivClass}
              data-item={item.symbol}
            >
              <div className="coin-summary-row" data-item={item.symbol}>
                <div
                  className="coin-summary__name context"
                  data-item={item.symbol}
                >{`${item.nameKo} (${item.symbol})`}</div>
                <div
                  className="coin-summary__mention context bold"
                  data-item={item.symbol}
                >
                  {`${item.mentionPercentage}%`}
                  <p className="context-bottom" data-item={item.symbol}>
                    {`${item.mentions}회`}
                  </p>
                </div>
                <div
                  className={`coin-summary__price context bold ${priceDivClass}`}
                  data-item={item.symbol}
                >
                  {`${sign}${item.priceChange}%`}
                  <p className="context-bottom" data-item={item.symbol}>
                    {`₩${formatNumber(item.price)}`}
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
        ? selectedCoin.priceChange >= 0
          ? "up"
          : "down"
        : "";
    const coinSummary =
      !this.props.isFetching && selectCoin !== null ? (
        <div className="coin-summary-content">
          <div className="coin-summary__name context">{`${
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
              {`₩${formatNumber(selectedCoin.price)}`}
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

    const nameSortOrderIcon =
      nameSortOrder === NOT_SELECTED ? (
        <div className="not-selected" />
      ) : nameSortOrder === ASC ? (
        <Icon name="triangle down" />
      ) : (
        <Icon name="triangle up" />
      );
    const mentionSortOrderIcon =
      mentionSortOrder === NOT_SELECTED ? (
        <div className="not-selected" />
      ) : mentionSortOrder === DESC ? (
        <Icon name="triangle down" />
      ) : (
        <Icon name="triangle up" />
      );
    const priceSortOrderIcon =
      priceSortOrder === NOT_SELECTED ? (
        <div className="not-selected" />
      ) : priceSortOrder === DESC ? (
        <Icon name="triangle down" />
      ) : (
        <Icon name="triangle up" />
      );
    return (
      <div className="coins">
        <div className={searchDivClass}>
          <button onClick={this.handleCloseClick} className="close-btn">
            Close
          </button>
          <Search
            loading={this.props.isFetching}
            onSearchChange={this.handleSearchChange}
          />
          <div className="coin-summary-list">
            <div className="coin-summary-header">
              <button
                className="coin-summary__name"
                onClick={this.handleSortByName}
              >
                이름(심볼)
                {nameSortOrderIcon}
              </button>
              <button
                className="coin-summary__mention"
                onClick={this.handleSortByMentions}
              >
                최근 커뮤니티 언급비율
                {mentionSortOrderIcon}
              </button>
              <button
                className="coin-summary__price"
                onClick={this.handleSortByPriceChange}
              >
                전일대비/시세
                {priceSortOrderIcon}
              </button>
            </div>
            {results.length === 0 ? (
              <div className="no-match">일치하는 검색 결과가 없습니다.</div>
            ) : (
              <ul className="coin-summary-rows" onClick={this.handleItemClick}>
                {rows}
              </ul>
            )}
          </div>
          <div className="transparent-background" />
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

const sortByNameAsc = (a, b) => {
  return a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : 0;
};
const sortByNameDesc = (a, b) => {
  return a.symbol > b.symbol ? -1 : a.symbol < b.symbol ? 1 : 0;
};

const sortByPriceChangeAsc = (a, b) => {
  return a.priceChange - b.priceChange;
};
const sortByPriceChangeDesc = (a, b) => {
  return b.priceChange - a.priceChange;
};

const sortListByMentionsDesc = (a, b) => {
  if (a.mentions === b.mentions) {
    return sortByNameAsc(a, b);
  } else {
    return b.mentions - a.mentions;
  }
};
const sortListByMentionsAsc = (a, b) => {
  if (a.mentions === b.mentions) {
    return sortByNameAsc(a, b);
  } else {
    return a.mentions - b.mentions;
  }
};

const sortByMentions = obj => {
  let list = Object.keys(obj).map(key => {
    return obj[key];
  });
  list.sort((a, b) => {
    if (a.mentions === b.mentions) {
      return sortByNameAsc(a, b);
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
    selectCoin: coin => dispatch(selectCoin(coin)),
    searchCoin: () => dispatch(searchCoin())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Coins);
