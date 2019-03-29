const rp = require("request-promise");

exports = module.exports = {};

exports.getCandleSticks = coin => {
  return new Promise((resolve, reject) => {
    const now = Math.floor(new Date() / 60000) * 60000;
    const twoHoursAgo = now - 7200000;
    const hourAgo = now - 3600000;
    const thirtyMinsAgo = now - 1800000;
    const tenMinsAgo = now - 600000;
    const sixMinsAgo = now - 360000;
    const twoMinsAgo = now - 120000;
    function isBeforeTwoHours(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime >= twoHoursAgo;
    }
    function notRightNow(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime < now;
    }
    const candleOptions = {
      method: "GET",
      url: "https://api.upbit.com/v1/candles/minutes/1",
      qs: { market: `KRW-${coin}`, count: "121" },
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
      const priceChange = parsedBody[0].signed_change_rate.toFixed(2);

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
            currentPrice: lastPrice,
            priceChange
          };

          resolve({ volumeChanges, priceChanges });
        } else {
          // when parsedBody.length > 0
          const data = parsedBody.filter(notRightNow);
          const hourData = data.filter(isBeforeTwoHours);
          let timestamps = [];
          let time = twoHoursAgo;
          for (let i = 0; i < 120; i++) {
            timestamps.push(time);
            time += 60000;
          }
          let filledData = [];
          for (let i = 0; i < 120; i++) {
            let item = hourData.filter(
              elem =>
                new Date(elem.candle_date_time_kst).getTime() === timestamps[i]
            );
            let candle;
            if (i === 0) {
              if (item === undefined || item.length === 0) {
                candle = {
                  timestamp: timestamps[i],
                  price: lastPrice,
                  volume: 0
                };
              } else {
                candle = {
                  timestamp: timestamps[i],
                  price: item[0].trade_price,
                  volume: item[0].candle_acc_trade_price
                };
              }
            } else {
              if (item === undefined || item.length === 0) {
                candle = {
                  timestamp: timestamps[i],
                  price: filledData[i - 1].price,
                  volume: 0
                };
              } else {
                candle = {
                  timestamp: timestamps[i],
                  price: item[0].trade_price,
                  volume: item[0].candle_acc_trade_price
                };
              }
            }
            filledData.push(candle);
          }

          let lastHourVolume = 0;
          let currentHourVolume = 0;
          let lastHourPrice = filledData[60].price;
          for (let i = 0; i < 120; i++) {
            if (i < 60) {
              lastHourVolume += filledData[i].volume;
            } else {
              currentHourVolume += filledData[i].volume;
            }
          }

          const thirtyMinData = filledData.filter(
            elem => elem.timestamp >= hourAgo
          );
          let lastThirtyMinVolume = 0;
          let currentThirtyMinVolume = 0;
          let lastThirtyMinPrice = thirtyMinData[30].price;
          for (let i = 0; i < 60; i++) {
            if (i < 30) {
              lastThirtyMinVolume += filledData[i].volume;
            } else {
              currentThirtyMinVolume += filledData[i].volume;
            }
          }

          const fifteenMinData = filledData.filter(
            elem => elem.timestamp >= thirtyMinsAgo
          );
          let lastFifteenMinVolume = 0;
          let currentFifteenMinVolume = 0;
          let lastFifteenMinPrice = fifteenMinData[15].price;
          for (let i = 0; i < 30; i++) {
            if (i < 15) {
              lastFifteenMinVolume += filledData[i].volume;
            } else {
              currentFifteenMinVolume += filledData[i].volume;
            }
          }

          const fiveMinData = filledData.filter(
            elem => elem.timestamp >= tenMinsAgo
          );
          let lastFiveMinVolume = 0;
          let currentFiveMinVolume = 0;
          let lastFiveMinPrice = fiveMinData[5].price;
          for (let i = 0; i < 10; i++) {
            if (i < 5) {
              lastFiveMinVolume += filledData[i].volume;
            } else {
              currentFiveMinVolume += filledData[i].volume;
            }
          }

          const threeMinData = filledData.filter(
            elem => elem.timestamp >= sixMinsAgo
          );
          let lastThreeMinVolume = 0;
          let currentThreeMinVolume = 0;
          let lastThreeMinPrice = threeMinData[3].price;
          for (let i = 0; i < 6; i++) {
            if (i < 3) {
              lastThreeMinVolume += filledData[i].volume;
            } else {
              currentThreeMinVolume += filledData[i].volume;
            }
          }

          const minData = filledData.filter(
            elem => elem.timestamp >= twoMinsAgo
          );
          let lastMinVolume = minData[0].volume;
          let currentMinVolume = minData[1].volume;
          let lastMinPrice = minData[0].price;
          let currentPrice = minData[1].price;

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
            currentPrice,
            priceChange
          };

          resolve({ volumeChanges, priceChanges });
        }
      });
    });
  });
};

exports.getOrderbook = coin => {
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

exports.getTrades = coin => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: "https://api.upbit.com/v1/trades/ticks",
      qs: { market: `KRW-${coin}`, count: 100 },
      json: true
    };

    rp(options)
      .then(parsedBody => {
        const asks = parsedBody.filter(obj => obj.ask_bid === "ASK");
        const bids = parsedBody.filter(obj => obj.ask_bid === "BID");

        let aggAsks = 0;
        asks.forEach(ask => {
          aggAsks += ask.trade_price * ask.trade_volume;
        });
        let aggBids = 0;
        bids.forEach(bid => {
          aggBids += bid.trade_price * bid.trade_volume;
        });
        resolve({ aggAsks, aggBids });
      })
      .catch(err => {
        reject("Upbit trade history err: ", err);
      });
  });
};
