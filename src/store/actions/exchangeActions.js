import {
  SELECT_EXCHANGE,
  RECEIVE_CANDLE_DATA,
  RECEIVE_ORDERBOOK_DATA
} from "../actionTypes";

const request = require("request");

const getUpbitCandleSticks = coin => {
  return dispatch => {
    const now = Math.floor(new Date() / 60000) * 60000;
    const twoHoursAgo = now - 7200000;
    const hourAgo = now - 3600000;
    const thirtyMinsAgo = now - 1800000;
    const fifteenMinsAgo = now - 900000;
    const tenMinsAgo = now - 600000;
    const sixMinsAgo = now - 360000;
    const fiveMinsAgo = now - 300000;
    const threeMinsAgo = now - 300000;
    const twoMinsAgo = now - 120000;
    const minAgo = now - 60000;

    function isBeforeTwoHours(data) {
      const candleTime = new Date(data.candle_date_time_utc).getTime();

      return candleTime > twoHoursAgo;
    }
    function isBeforeHour(data) {
      const candleTime = new Date(data.candle_date_time_utc).getTime();

      return candleTime > hourAgo;
    }
    function isBeforeThirtyMins(data) {
      const candleTime = new Date(data.candle_date_time_utc).getTime();

      return candleTime > thirtyMinsAgo;
    }
    function isBeforeTenMins(data) {
      const candleTime = new Date(data.candle_date_time_utc).getTime();

      return candleTime > tenMinsAgo;
    }
    function isBeforeSixMins(data) {
      const candleTime = new Date(data.candle_date_time_utc).getTime();

      return candleTime > sixMinsAgo;
    }
    function isBeforeTwoMins(data) {
      const candleTime = new Date(data.candle_date_time_utc).getTime();

      return candleTime > twoMinsAgo;
    }
    const options = {
      method: "GET",
      url: "https://api.upbit.com/v1/candles/minutes/1",
      qs: { market: `KRW-${coin}`, count: "120" }
    };

    request(options, (err, response, result) => {
      if (err) {
        console.log("Error retrieving upbit candle data: ", err);
        return;
      }
      const obj = JSON.parse(result);

      //Edge case: if there has been no trades for 2 hrs.
      if (obj.length == 0) {
        const subOptions = {
          method: "GET",
          url: "https://api.upbit.com/v1/ticker",
          qs: { markets: `KRW-${coin}` }
        };
        request(subOptions, (err, response, result) => {
          if (err) {
            console.log("Error retrieving upbit ticker data: ", err);
            return;
          }
          const obj = JSON.parse(result);
          const lastPrice = obj[0].trade_price;

          const volumeChanges = {
            hourVolumeChange: 0,
            thirtyMinVolumeChange: 0,
            fifteenMinVolumeChange: 0,
            fiveMinVolumeChange: 0,
            threeMinVolumeChange: 0,
            minVolumeChange: 0,
            currentHourVolume: 0,
            currentThirtyMinVolume: 0,
            currentFifteenMinVolume: 0,
            currentFiveMinVolume: 0,
            currentThreeMinVolume: 0,
            currentMinVolume: 0
          };
          const priceChanges = {
            hourPriceChange: 0,
            thirtyMinPriceChange: 0,
            fifteenMinPriceChange: 0,
            fiveMinPriceChange: 0,
            threeMinPriceChange: 0,
            minPriceChange: 0,
            currentPrice: lastPrice
          };

          dispatch({ type: RECEIVE_CANDLE_DATA, volumeChanges, priceChanges });
        });
      } else {
        // when obj.length > 0
        const hourData = obj.filter(isBeforeTwoHours);
        let lastHourVolume = 0;
        let currentHourVolume = 0;
        let lastHourPrice = hourData[0].trade_price;
        hourData.forEach(elem => {
          if (elem.candle_date_time_utc < hourAgo) {
            lastHourVolume += elem.candle_acc_trade_price;
            lastHourPrice = elem.trade_price;
          } else {
            currentHourVolume += elem.candle_acc_trade_price;
          }
        });

        const thirtyMinData = obj.filter(isBeforeHour);
        let lastThirtyMinVolume = 0;
        let currentThirtyMinVolume = 0;
        let lastThirtyMinPrice = hourData[0].trade_price;
        thirtyMinData.forEach(elem => {
          if (elem.candle_date_time_utc < thirtyMinsAgo) {
            lastThirtyMinVolume += elem.candle_acc_trade_price;
            lastThirtyMinPrice = elem.trade_price;
          } else {
            currentThirtyMinVolume += elem.candle_acc_trade_price;
          }
        });

        const fifteenMinData = obj.filter(isBeforeThirtyMins);
        let lastFifteenMinVolume = 0;
        let currentFifteenMinVolume = 0;
        let lastFifteenMinPrice = hourData[0].trade_price;
        fifteenMinData.forEach(elem => {
          if (elem.candle_date_time_utc < fifteenMinsAgo) {
            lastFifteenMinVolume += elem.candle_acc_trade_price;
            lastFifteenMinPrice = elem.trade_price;
          } else {
            currentFifteenMinVolume += elem.candle_acc_trade_price;
          }
        });

        const fiveMinData = obj.filter(isBeforeTenMins);
        let lastFiveMinVolume = 0;
        let currentFiveMinVolume = 0;
        let lastFiveMinPrice = hourData[0].trade_price;
        fiveMinData.forEach(elem => {
          if (elem.candle_date_time_utc < fiveMinsAgo) {
            lastFiveMinVolume += elem.candle_acc_trade_price;
            lastFiveMinPrice = elem.trade_price;
          } else {
            currentFiveMinVolume += elem.candle_acc_trade_price;
          }
        });

        const threeMinData = obj.filter(isBeforeSixMins);
        let lastThreeMinVolume = 0;
        let currentThreeMinVolume = 0;
        let lastThreeMinPrice = hourData[0].trade_price;
        threeMinData.forEach(elem => {
          if (elem.candle_date_time_utc < threeMinsAgo) {
            lastThreeMinVolume += elem.candle_acc_trade_price;
            lastThreeMinPrice = elem.trade_price;
          } else {
            currentThreeMinVolume += elem.candle_acc_trade_price;
          }
        });

        const minData = obj.filter(isBeforeTwoMins);
        let lastMinVolume = 0;
        let currentMinVolume = 0;
        let lastMinPrice = hourData[0].trade_price;
        let currentPrice = hourData.reverse()[0].trade_price;
        minData.forEach(elem => {
          if (elem.candle_date_time_utc < minAgo) {
            lastMinVolume += elem.candle_acc_trade_price;
            lastMinPrice = elem.trade_price;
          } else {
            currentMinVolume += elem.candle_acc_trade_price;
          }
        });

        const hourVolumeChange =
          lastHourVolume !== 0
            ? Math.round((currentHourVolume / lastHourVolume) * 100 - 100)
            : 0;
        const thirtyMinVolumeChange =
          lastThirtyMinVolume !== 0
            ? Math.round(
                (currentThirtyMinVolume / lastThirtyMinVolume) * 100 - 100
              )
            : 0;
        const fifteenMinVolumeChange =
          lastFifteenMinVolume !== 0
            ? Math.round(
                (currentFifteenMinVolume / lastFifteenMinVolume) * 100 - 100
              )
            : 0;
        const fiveMinVolumeChange =
          lastFiveMinVolume !== 0
            ? Math.round((currentFiveMinVolume / lastFiveMinVolume) * 100 - 100)
            : 0;
        const threeMinVolumeChange =
          lastThreeMinVolume !== 0
            ? Math.round(
                (currentThreeMinVolume / lastThreeMinVolume) * 100 - 100
              )
            : 0;
        const minVolumeChange =
          lastMinVolume !== 0
            ? Math.round((currentMinVolume / lastMinVolume) * 100 - 100)
            : 0;
        const hourPriceChange =
          lastHourPrice !== 0
            ? Math.round((currentPrice / lastHourPrice) * 100 - 100)
            : 0;
        const thirtyMinPriceChange =
          lastThirtyMinPrice !== 0
            ? Math.round((currentPrice / lastThirtyMinPrice) * 100 - 100)
            : 0;
        const fifteenMinPriceChange =
          lastFifteenMinPrice !== 0
            ? Math.round((currentPrice / lastFifteenMinPrice) * 100 - 100)
            : 0;
        const fiveMinPriceChange =
          lastFiveMinPrice !== 0
            ? Math.round((currentPrice / lastFiveMinPrice) * 100 - 100)
            : 0;
        const threeMinPriceChange =
          lastThreeMinPrice !== 0
            ? Math.round((currentPrice / lastThreeMinPrice) * 100 - 100)
            : 0;
        const minPriceChange =
          lastMinPrice !== 0
            ? Math.round((currentPrice / lastMinPrice) * 100 - 100)
            : 0;

        const volumeChanges = {
          hourVolumeChange,
          thirtyMinVolumeChange,
          fifteenMinVolumeChange,
          fiveMinVolumeChange,
          threeMinVolumeChange,
          minVolumeChange,
          currentHourVolume,
          currentThirtyMinVolume,
          currentFifteenMinVolume,
          currentFiveMinVolume,
          currentThreeMinVolume,
          currentMinVolume
        };
        const priceChanges = {
          hourPriceChange,
          thirtyMinPriceChange,
          fifteenMinPriceChange,
          fiveMinPriceChange,
          threeMinPriceChange,
          minPriceChange,
          currentPrice
        };

        dispatch({ type: RECEIVE_CANDLE_DATA, volumeChanges, priceChanges });
      }
    });
  };
};

const getUpbitOrderbook = coin => {
  return dispatch => {
    const options = {
      method: "GET",
      url: "https://api.upbit.com/v1/orderbook",
      qs: { markets: `KRW-${coin}` }
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      const obj = JSON.parse(body);

      const aggAsks = obj[0].total_ask_size;
      const aggBids = obj[0].total_bid_size;

      const highestBidPrice = obj[0].orderbook_units[0].bid_price;
      const highestBidQuantity = obj[0].orderbook_units[0].bid_size;
      const lowestAskPrice = obj[0].orderbook_units[0].ask_price;
      const lowestAskQuantity = obj[0].orderbook_units[0].ask_size;

      const aggOrders = { aggAsks, aggBids };
      const bidAsk = {
        highestBidPrice,
        highestBidQuantity,
        lowestAskPrice,
        lowestAskQuantity
      };

      dispatch({ type: RECEIVE_ORDERBOOK_DATA, aggOrders, bidAsk });
    });
  };
};

const getUpbitTrades = coin => {};

const getBithumbCandleSticks = coin => {
  return dispatch => {
    const now = new Date();
    const from = Math.floor((now - 7200000) / 60000) * 60 - 1;
    const to = Math.ceil(now / 60000) * 60;

    const twoHoursAgo = now - 7200000;
    const hourAgo = now - 3600000;
    const thirtyMinsAgo = now - 1800000;
    const fifteenMinsAgo = now - 900000;
    const tenMinsAgo = now - 600000;
    const sixMinsAgo = now - 360000;
    const fiveMinsAgo = now - 300000;
    const threeMinsAgo = now - 300000;
    const twoMinsAgo = now - 120000;
    const minAgo = now - 60000;

    const options = {
      method: "GET",
      url: `https://www.bithumb.com/resources/chart/${coin}_xcoinTrade_01M.json?symbol=BTC&resolution=0.5&from=${from}&to=${to}&strTime=${now}`
    };
    request(options, (err, res, result) => {
      if (err) throw new Error(err);

      const obj = JSON.parse(result);
      console.log(obj);

      //Edge case: if there has been no trades for 2 hrs.
      if (obj.length == 0) {
        const subOptions = {
          method: "GET",
          url: `https://api.bithum.com/public/ticker/${coin}`
        };
        request(subOptions, (err, response, result) => {
          if (err) {
            console.log("Error retrieving bithumb ticker data: ", err);
            return;
          }
          const obj = JSON.parse(result);
          const lastPrice = obj.data.closing_price;

          const volumeChanges = {
            hourVolumeChange: 0,
            thirtyMinVolumeChange: 0,
            fifteenMinVolumeChange: 0,
            fiveMinVolumeChange: 0,
            threeMinVolumeChange: 0,
            minVolumeChange: 0,
            currentHourVolume: 0,
            currentThirtyMinVolume: 0,
            currentFifteenMinVolume: 0,
            currentFiveMinVolume: 0,
            currentThreeMinVolume: 0,
            currentMinVolume: 0
          };
          const priceChanges = {
            hourPriceChange: 0,
            thirtyMinPriceChange: 0,
            fifteenMinPriceChange: 0,
            fiveMinPriceChange: 0,
            threeMinPriceChange: 0,
            minPriceChange: 0,
            currentPrice: lastPrice
          };

          dispatch({ type: RECEIVE_CANDLE_DATA, volumeChanges, priceChanges });
        });
      } else {
        // when obj.length > 0
        const hourData = obj.filter(elem => elem[0] > twoHoursAgo);
        let lastHourVolume = 0;
        let currentHourVolume = 0;
        let lastHourPrice = hourData[0][4];
        hourData.forEach(elem => {
          if (elem[0] < hourAgo) {
            lastHourVolume += elem[5];
            lastHourPrice = elem[4];
          } else {
            currentHourVolume += elem[5];
          }
        });

        const thirtyMinData = obj.filter(elem => elem[0] > hourAgo);
        let lastThirtyMinVolume = 0;
        let currentThirtyMinVolume = 0;
        let lastThirtyMinPrice = hourData[0][4];
        thirtyMinData.forEach(elem => {
          if (elem[0] < thirtyMinsAgo) {
            lastThirtyMinVolume += elem[5];
            lastThirtyMinPrice = elem[4];
          } else {
            currentThirtyMinVolume += elem[5];
          }
        });

        const fifteenMinData = obj.filter(elem => elem[0] > thirtyMinsAgo);
        let lastFifteenMinVolume = 0;
        let currentFifteenMinVolume = 0;
        let lastFifteenMinPrice = hourData[0][4];
        fifteenMinData.forEach(elem => {
          if (elem[0] < fifteenMinsAgo) {
            lastFifteenMinVolume += elem[5];
            lastFifteenMinPrice = elem[4];
          } else {
            currentFifteenMinVolume += elem[5];
          }
        });

        const fiveMinData = obj.filter(elem => elem[0] > tenMinsAgo);
        let lastFiveMinVolume = 0;
        let currentFiveMinVolume = 0;
        let lastFiveMinPrice = hourData[0][4];
        fiveMinData.forEach(elem => {
          if (elem[0] < fiveMinsAgo) {
            lastFiveMinVolume += elem[5];
            lastFiveMinPrice = elem[4];
          } else {
            currentFiveMinVolume += elem[5];
          }
        });

        const threeMinData = obj.filter(elem => elem[0] > sixMinsAgo);
        let lastThreeMinVolume = 0;
        let currentThreeMinVolume = 0;
        let lastThreeMinPrice = hourData[0][4];
        threeMinData.forEach(elem => {
          if (elem[0] < threeMinsAgo) {
            lastThreeMinVolume += elem[5];
            lastThreeMinPrice = elem[4];
          } else {
            currentThreeMinVolume += elem[5];
          }
        });

        const minData = obj.filter(elem => elem[0] > twoMinsAgo);
        let lastMinVolume = 0;
        let currentMinVolume = 0;
        let lastMinPrice = hourData[0][4];
        let currentPrice = hourData.reverse()[0][4];
        minData.forEach(elem => {
          if (elem[0] < minAgo) {
            lastMinVolume += elem[5];
            lastMinPrice = elem[4];
          } else {
            currentMinVolume += elem[5];
          }
        });

        const hourVolumeChange =
          lastHourVolume !== 0
            ? Math.round((currentHourVolume / lastHourVolume) * 100 - 100)
            : 0;
        const thirtyMinVolumeChange =
          lastThirtyMinVolume !== 0
            ? Math.round(
                (currentThirtyMinVolume / lastThirtyMinVolume) * 100 - 100
              )
            : 0;
        const fifteenMinVolumeChange =
          lastFifteenMinVolume !== 0
            ? Math.round(
                (currentFifteenMinVolume / lastFifteenMinVolume) * 100 - 100
              )
            : 0;
        const fiveMinVolumeChange =
          lastFiveMinVolume !== 0
            ? Math.round((currentFiveMinVolume / lastFiveMinVolume) * 100 - 100)
            : 0;
        const threeMinVolumeChange =
          lastThreeMinVolume !== 0
            ? Math.round(
                (currentThreeMinVolume / lastThreeMinVolume) * 100 - 100
              )
            : 0;
        const minVolumeChange =
          lastMinVolume !== 0
            ? Math.round((currentMinVolume / lastMinVolume) * 100 - 100)
            : 0;
        const hourPriceChange =
          lastHourPrice !== 0
            ? Math.round((currentPrice / lastHourPrice) * 100 - 100)
            : 0;
        const thirtyMinPriceChange =
          lastThirtyMinPrice !== 0
            ? Math.round((currentPrice / lastThirtyMinPrice) * 100 - 100)
            : 0;
        const fifteenMinPriceChange =
          lastFifteenMinPrice !== 0
            ? Math.round((currentPrice / lastFifteenMinPrice) * 100 - 100)
            : 0;
        const fiveMinPriceChange =
          lastFiveMinPrice !== 0
            ? Math.round((currentPrice / lastFiveMinPrice) * 100 - 100)
            : 0;
        const threeMinPriceChange =
          lastThreeMinPrice !== 0
            ? Math.round((currentPrice / lastThreeMinPrice) * 100 - 100)
            : 0;
        const minPriceChange =
          lastMinPrice !== 0
            ? Math.round((currentPrice / lastMinPrice) * 100 - 100)
            : 0;

        const volumeChanges = {
          hourVolumeChange,
          thirtyMinVolumeChange,
          fifteenMinVolumeChange,
          fiveMinVolumeChange,
          threeMinVolumeChange,
          minVolumeChange,
          currentHourVolume,
          currentThirtyMinVolume,
          currentFifteenMinVolume,
          currentFiveMinVolume,
          currentThreeMinVolume,
          currentMinVolume
        };
        const priceChanges = {
          hourPriceChange,
          thirtyMinPriceChange,
          fifteenMinPriceChange,
          fiveMinPriceChange,
          threeMinPriceChange,
          minPriceChange,
          currentPrice
        };
        dispatch({ type: RECEIVE_CANDLE_DATA, volumeChanges, priceChanges });
      }
    });
  };
};

const getBithumbOrderbook = coin => {
  return dispatch => {
    const options = {
      method: "GET",
      uri: `https://api.bithumb.com/public/orderbook/${coin}`,
      qs: { count: 50 }
    };
    request(options, (err, res, result) => {
      if (err) throw new Error(err);

      const obj = JSON.parse(result);
      let aggBids = 0,
        aggAsks = 0;
      obj.data.bids.forEach(bid => {
        aggBids += parseFloat(bid.quantity);
      });
      obj.data.asks.forEach(ask => {
        aggAsks += parseFloat(ask.quantity);
      });
      const highestBidPrice = obj.data.bids.sort((a, b) => {
        return a > b ? -1 : 1;
      })[0].price;
      const highestBidQuantity = obj.data.bids.sort((a, b) => {
        return a > b ? -1 : 1;
      })[0].quantity;
      const lowestAskPrice = obj.data.asks.sort()[0].price;
      const lowestAskQuantity = obj.data.asks.sort()[0].quantity;

      const aggOrders = { aggAsks, aggBids };
      const bidAsk = {
        highestBidPrice,
        highestBidQuantity,
        lowestAskPrice,
        lowestAskQuantity
      };

      dispatch({ type: RECEIVE_ORDERBOOK_DATA, aggOrders, bidAsk });
    });
  };
};

const getBithumbTrades = coin => {};

export const selectExchange = exchange => {
  //make async requests to exchange api or db
  return (dispatch, getState) => {
    const selectedCoin = getState().coin.selectedCoin;
    dispatch({ type: SELECT_EXCHANGE, exchange });

    if (exchange === "Upbit") {
      getUpbitCandleSticks(selectedCoin);
      getUpbitOrderbook(selectedCoin);
    } else if (exchange === "Bithumb") {
      getBithumbCandleSticks(selectedCoin);
      getBithumbOrderbook(selectedCoin);
    }
  };
};
