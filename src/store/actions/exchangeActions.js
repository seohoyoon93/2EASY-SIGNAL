import {
  SELECT_EXCHANGE,
  RECEIVE_CANDLE_DATA,
  RECEIVE_ORDERBOOK_DATA
} from "../actionTypes";

const rp = require("request-promise");

const getUpbitCandleSticks = coin => {
  return new Promise((resolve, reject) => {
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
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime > twoHoursAgo;
    }
    function isBeforeHour(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime > hourAgo;
    }
    function isBeforeThirtyMins(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime > thirtyMinsAgo;
    }
    function isBeforeTenMins(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime > tenMinsAgo;
    }
    function isBeforeSixMins(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime > sixMinsAgo;
    }
    function isBeforeTwoMins(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime > twoMinsAgo;
    }
    const candleOptions = {
      method: "GET",
      url: "https://api.upbit.com/v1/candles/minutes/1",
      qs: { market: `KRW-${coin}`, count: "120" },
      json: true
    };

    const tickerOptions = {
      method: "GET",
      url: "https://api.upbit.com/v1/ticker",
      qs: { markets: `KRW-${coin}` },
      json: true
    };

    rp(tickerOptions).then(parsedBody => {
      const accTradeVol24h = parsedBody[0].acc_trade_price_24h;
      const lastPrice = parsedBody[0].trade_price;

      rp(candleOptions).then(parsedBody => {
        if (parsedBody.length === 0) {
          const volumeChanges = {
            accTradeVol24h,
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

          resolve({ volumeChanges, priceChanges });
        } else {
          // when parsedBody.length > 0
          const hourData = parsedBody.filter(isBeforeTwoHours);
          let lastHourVolume = 0;
          let currentHourVolume = 0;
          let lastHourPrice = hourData[0].trade_price;
          hourData.forEach(elem => {
            if (new Date(elem.candle_date_time_kst).getTime() < hourAgo) {
              lastHourVolume += elem.candle_acc_trade_price;
              lastHourPrice = elem.trade_price;
            } else {
              currentHourVolume += elem.candle_acc_trade_price;
            }
          });

          const thirtyMinData = parsedBody.filter(isBeforeHour);
          let lastThirtyMinVolume = 0;
          let currentThirtyMinVolume = 0;
          let lastThirtyMinPrice = hourData[0].trade_price;
          thirtyMinData.forEach(elem => {
            if (new Date(elem.candle_date_time_kst).getTime() < thirtyMinsAgo) {
              lastThirtyMinVolume += elem.candle_acc_trade_price;
              lastThirtyMinPrice = elem.trade_price;
            } else {
              currentThirtyMinVolume += elem.candle_acc_trade_price;
            }
          });

          const fifteenMinData = parsedBody.filter(isBeforeThirtyMins);
          let lastFifteenMinVolume = 0;
          let currentFifteenMinVolume = 0;
          let lastFifteenMinPrice = hourData[0].trade_price;
          fifteenMinData.forEach(elem => {
            if (
              new Date(elem.candle_date_time_kst).getTime() < fifteenMinsAgo
            ) {
              lastFifteenMinVolume += elem.candle_acc_trade_price;
              lastFifteenMinPrice = elem.trade_price;
            } else {
              currentFifteenMinVolume += elem.candle_acc_trade_price;
            }
          });

          const fiveMinData = parsedBody.filter(isBeforeTenMins);
          let lastFiveMinVolume = 0;
          let currentFiveMinVolume = 0;
          let lastFiveMinPrice = hourData[0].trade_price;
          fiveMinData.forEach(elem => {
            if (new Date(elem.candle_date_time_kst).getTime() < fiveMinsAgo) {
              lastFiveMinVolume += elem.candle_acc_trade_price;
              lastFiveMinPrice = elem.trade_price;
            } else {
              currentFiveMinVolume += elem.candle_acc_trade_price;
            }
          });

          const threeMinData = parsedBody.filter(isBeforeSixMins);
          let lastThreeMinVolume = 0;
          let currentThreeMinVolume = 0;
          let lastThreeMinPrice = hourData[0].trade_price;
          threeMinData.forEach(elem => {
            if (new Date(elem.candle_date_time_kst).getTime() < threeMinsAgo) {
              lastThreeMinVolume += elem.candle_acc_trade_price;
              lastThreeMinPrice = elem.trade_price;
            } else {
              currentThreeMinVolume += elem.candle_acc_trade_price;
            }
          });

          const minData = parsedBody.filter(isBeforeTwoMins);
          let lastMinVolume = 0;
          let currentMinVolume = 0;
          let lastMinPrice = hourData[0].trade_price;
          let currentPrice = hourData.reverse()[0].trade_price;
          minData.forEach(elem => {
            if (new Date(elem.candle_date_time_kst).getTime() < minAgo) {
              lastMinVolume += elem.candle_acc_trade_price;
              lastMinPrice = elem.trade_price;
            } else {
              currentMinVolume += elem.candle_acc_trade_price;
            }
          });

          const hourVolumeChange =
            lastHourVolume !== 0
              ? ((currentHourVolume / lastHourVolume) * 100 - 100).toFixed(2)
              : 0;
          const thirtyMinVolumeChange =
            lastThirtyMinVolume !== 0
              ? (
                  (currentThirtyMinVolume / lastThirtyMinVolume) * 100 -
                  100
                ).toFixed(2)
              : 0;
          const fifteenMinVolumeChange =
            lastFifteenMinVolume !== 0
              ? (
                  (currentFifteenMinVolume / lastFifteenMinVolume) * 100 -
                  100
                ).toFixed(2)
              : 0;
          const fiveMinVolumeChange =
            lastFiveMinVolume !== 0
              ? (
                  (currentFiveMinVolume / lastFiveMinVolume) * 100 -
                  100
                ).toFixed(2)
              : 0;
          const threeMinVolumeChange =
            lastThreeMinVolume !== 0
              ? (
                  (currentThreeMinVolume / lastThreeMinVolume) * 100 -
                  100
                ).toFixed(2)
              : 0;
          const minVolumeChange =
            lastMinVolume !== 0
              ? ((currentMinVolume / lastMinVolume) * 100 - 100).toFixed(2)
              : 0;
          const hourPriceChange =
            lastHourPrice !== 0
              ? ((currentPrice / lastHourPrice) * 100 - 100).toFixed(2)
              : 0;
          const thirtyMinPriceChange =
            lastThirtyMinPrice !== 0
              ? ((currentPrice / lastThirtyMinPrice) * 100 - 100).toFixed(2)
              : 0;

          const fifteenMinPriceChange =
            lastFifteenMinPrice !== 0
              ? ((currentPrice / lastFifteenMinPrice) * 100 - 100).toFixed(2)
              : 0;

          const fiveMinPriceChange =
            lastFiveMinPrice !== 0
              ? ((currentPrice / lastFiveMinPrice) * 100 - 100).toFixed(2)
              : 0;
          const threeMinPriceChange =
            lastThreeMinPrice !== 0
              ? ((currentPrice / lastThreeMinPrice) * 100 - 100).toFixed(2)
              : 0;
          const minPriceChange =
            lastMinPrice !== 0
              ? ((currentPrice / lastMinPrice) * 100 - 100).toFixed(2)
              : 0;

          const volumeChanges = {
            accTradeVol24h,
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

          resolve({ volumeChanges, priceChanges });
        }
      });
    });
  });
};

const getUpbitOrderbook = coin => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: "https://api.upbit.com/v1/orderbook",
      qs: { markets: `KRW-${coin}` },
      json: true
    };

    rp(options).then(parsedBody => {
      const aggAsks = parsedBody[0].total_ask_size;
      const aggBids = parsedBody[0].total_bid_size;

      const highestBidPrice = parsedBody[0].orderbook_units[0].bid_price;
      const highestBidQuantity = parsedBody[0].orderbook_units[0].bid_size;
      const lowestAskPrice = parsedBody[0].orderbook_units[0].ask_price;
      const lowestAskQuantity = parsedBody[0].orderbook_units[0].ask_size;

      const aggOrders = { aggAsks, aggBids };
      const bidAsk = {
        highestBidPrice,
        highestBidQuantity,
        lowestAskPrice,
        lowestAskQuantity
      };

      resolve({ aggOrders, bidAsk });
    });
  });
};

const getUpbitTrades = coin => {};

const getBithumbCandleSticks = coin => {
  return new Promise((resolve, reject) => {
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

    const tickerOptions = {
      method: "GET",
      url: `https://api.bithumb.com/public/ticker/${coin}`,
      json: true
    };

    rp(tickerOptions).then(parsedBody => {
      const accTradeVol24h = parsedBody.data.volume_1day;
      const lastPrice = parsedBody.data.opening_price;

      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let parsedBody = JSON.parse(xhr.responseText);

          if (parsedBody.length === 0) {
            const volumeChanges = {
              accTradeVol24h,
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

            resolve(volumeChanges, priceChanges);
          } else {
            // when parsedBody.length > 0

            const hourData = parsedBody.filter(elem => elem[0] > twoHoursAgo);
            let lastHourVolume = 0;
            let currentHourVolume = 0;
            let lastHourPrice = hourData[0][4];
            hourData.forEach(elem => {
              if (elem[0] < hourAgo) {
                lastHourVolume += parseFloat(elem[5]);
                lastHourPrice = parseFloat(elem[4]);
              } else {
                currentHourVolume += parseFloat(elem[5]);
              }
            });

            const thirtyMinData = parsedBody.filter(elem => elem[0] > hourAgo);
            let lastThirtyMinVolume = 0;
            let currentThirtyMinVolume = 0;
            let lastThirtyMinPrice = hourData[0][4];
            thirtyMinData.forEach(elem => {
              if (elem[0] < thirtyMinsAgo) {
                lastThirtyMinVolume += parseFloat(elem[5]);
                lastThirtyMinPrice = parseFloat(elem[4]);
              } else {
                currentThirtyMinVolume += parseFloat(elem[5]);
              }
            });

            const fifteenMinData = parsedBody.filter(
              elem => elem[0] > thirtyMinsAgo
            );
            let lastFifteenMinVolume = 0;
            let currentFifteenMinVolume = 0;
            let lastFifteenMinPrice = hourData[0][4];
            fifteenMinData.forEach(elem => {
              if (elem[0] < fifteenMinsAgo) {
                lastFifteenMinVolume += parseFloat(elem[5]);
                lastFifteenMinPrice = parseFloat(elem[4]);
              } else {
                currentFifteenMinVolume += parseFloat(elem[5]);
              }
            });

            const fiveMinData = parsedBody.filter(elem => elem[0] > tenMinsAgo);
            let lastFiveMinVolume = 0;
            let currentFiveMinVolume = 0;
            let lastFiveMinPrice = hourData[0][4];
            fiveMinData.forEach(elem => {
              if (elem[0] < fiveMinsAgo) {
                lastFiveMinVolume += parseFloat(elem[5]);
                lastFiveMinPrice = parseFloat(elem[4]);
              } else {
                currentFiveMinVolume += parseFloat(elem[5]);
              }
            });

            const threeMinData = parsedBody.filter(
              elem => elem[0] > sixMinsAgo
            );
            let lastThreeMinVolume = 0;
            let currentThreeMinVolume = 0;
            let lastThreeMinPrice = hourData[0][4];
            threeMinData.forEach(elem => {
              if (elem[0] < threeMinsAgo) {
                lastThreeMinVolume += parseFloat(elem[5]);
                lastThreeMinPrice = parseFloat(elem[4]);
              } else {
                currentThreeMinVolume += parseFloat(elem[5]);
              }
            });

            const minData = parsedBody.filter(elem => elem[0] > twoMinsAgo);
            let lastMinVolume = 0;
            let currentMinVolume = 0;
            let lastMinPrice = hourData[0][4];
            let currentPrice = hourData.reverse()[0][4];
            minData.forEach(elem => {
              if (elem[0] < minAgo) {
                lastMinVolume += parseFloat(elem[5]);
                lastMinPrice = parseFloat(elem[4]);
              } else {
                currentMinVolume += parseFloat(elem[5]);
              }
            });

            const hourVolumeChange =
              lastHourVolume !== 0
                ? ((currentHourVolume / lastHourVolume) * 100 - 100).toFixed(2)
                : 0;
            const thirtyMinVolumeChange =
              lastThirtyMinVolume !== 0
                ? (
                    (currentThirtyMinVolume / lastThirtyMinVolume) * 100 -
                    100
                  ).toFixed(2)
                : 0;
            const fifteenMinVolumeChange =
              lastFifteenMinVolume !== 0
                ? (
                    (currentFifteenMinVolume / lastFifteenMinVolume) * 100 -
                    100
                  ).toFixed(2)
                : 0;
            const fiveMinVolumeChange =
              lastFiveMinVolume !== 0
                ? (
                    (currentFiveMinVolume / lastFiveMinVolume) * 100 -
                    100
                  ).toFixed(2)
                : 0;
            const threeMinVolumeChange =
              lastThreeMinVolume !== 0
                ? (
                    (currentThreeMinVolume / lastThreeMinVolume) * 100 -
                    100
                  ).toFixed(2)
                : 0;
            const minVolumeChange =
              lastMinVolume !== 0
                ? ((currentMinVolume / lastMinVolume) * 100 - 100).toFixed(2)
                : 0;
            const hourPriceChange =
              lastHourPrice !== 0
                ? ((currentPrice / lastHourPrice) * 100 - 100).toFixed(2)
                : 0;
            const thirtyMinPriceChange =
              lastThirtyMinPrice !== 0
                ? ((currentPrice / lastThirtyMinPrice) * 100 - 100).toFixed(2)
                : 0;
            const fifteenMinPriceChange =
              lastFifteenMinPrice !== 0
                ? ((currentPrice / lastFifteenMinPrice) * 100 - 100).toFixed(2)
                : 0;
            const fiveMinPriceChange =
              lastFiveMinPrice !== 0
                ? ((currentPrice / lastFiveMinPrice) * 100 - 100).toFixed(2)
                : 0;
            const threeMinPriceChange =
              lastThreeMinPrice !== 0
                ? ((currentPrice / lastThreeMinPrice) * 100 - 100).toFixed(2)
                : 0;
            const minPriceChange =
              lastMinPrice !== 0
                ? ((currentPrice / lastMinPrice) * 100 - 100).toFixed(2)
                : 0;

            const volumeChanges = {
              accTradeVol24h,
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
            resolve({ volumeChanges, priceChanges });
          }
        }
      };
      xhr.open(
        "GET",
        `https://cors-anywhere.herokuapp.com/https://www.bithumb.com/resources/chart/${coin}_xcoinTrade_01M.json?symbol=${coin}&resolution=0.5&from=${from}&to=${to}&strTime=${now}`
      );
      xhr.send();
    });
  });
};

const getBithumbOrderbook = coin => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      uri: `https://api.bithumb.com/public/orderbook/${coin}`,
      qs: { count: 50 },
      json: true
    };
    rp(options).then(parsedBody => {
      let aggBids = 0,
        aggAsks = 0;

      parsedBody.data.bids.forEach(bid => {
        aggBids += parseFloat(bid.quantity);
      });
      parsedBody.data.asks.forEach(ask => {
        aggAsks += parseFloat(ask.quantity);
      });

      const highestBidPrice = parsedBody.data.bids.sort((a, b) => {
        return a > b ? -1 : 1;
      })[0].price;
      const highestBidQuantity = parsedBody.data.bids.sort((a, b) => {
        return a > b ? -1 : 1;
      })[0].quantity;
      const lowestAskPrice = parsedBody.data.asks.sort()[0].price;
      const lowestAskQuantity = parsedBody.data.asks.sort()[0].quantity;

      const aggOrders = { aggAsks, aggBids };
      const bidAsk = {
        highestBidPrice,
        highestBidQuantity,
        lowestAskPrice,
        lowestAskQuantity
      };

      resolve({ aggOrders, bidAsk });
    });
  });
};

const getBithumbTrades = coin => {};

export const selectExchange = exchange => {
  //make async requests to exchange api or db
  return (dispatch, getState) => {
    const selectedCoin = getState().coin.selectedCoin;
    dispatch({ type: SELECT_EXCHANGE, exchange });

    if (exchange === "Upbit") {
      return getUpbitCandleSticks(selectedCoin).then(candleData => {
        dispatch({
          type: RECEIVE_CANDLE_DATA,
          volumeChanges: candleData.volumeChanges,
          priceChanges: candleData.priceChanges
        });
        getUpbitOrderbook(selectedCoin).then(orderbookData => {
          dispatch({
            type: RECEIVE_ORDERBOOK_DATA,
            aggOrders: orderbookData.aggOrders,
            bidAsk: orderbookData.bidAsk
          });
        });
      });
    } else if (exchange === "Bithumb") {
      return getBithumbCandleSticks(selectedCoin).then(candleData => {
        dispatch({
          type: RECEIVE_CANDLE_DATA,
          volumeChanges: candleData.volumeChanges,
          priceChanges: candleData.priceChanges
        });
        getBithumbOrderbook(selectedCoin).then(orderbookData => {
          dispatch({
            type: RECEIVE_ORDERBOOK_DATA,
            aggOrders: orderbookData.aggOrders,
            bidAsk: orderbookData.bidAsk
          });
        });
      });
    }
  };
};
