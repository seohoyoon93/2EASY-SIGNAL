const rp = require("request-promise");

exports = module.exports = {};

exports.getCandleSticks = coin => {
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

      return candleTime >= twoHoursAgo;
    }
    function isBeforeHour(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime >= hourAgo;
    }
    function isBeforeThirtyMins(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime >= thirtyMinsAgo;
    }
    function isBeforeTenMins(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime >= tenMinsAgo;
    }
    function isBeforeSixMins(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime >= sixMinsAgo;
    }
    function isBeforeTwoMins(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime >= twoMinsAgo;
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
          const data = parsedBody.filter(notRightNow);
          const hourData = data.filter(isBeforeTwoHours);
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

          const thirtyMinData = data.filter(isBeforeHour);
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

          const fifteenMinData = data.filter(isBeforeThirtyMins);
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

          const fiveMinData = data.filter(isBeforeTenMins);
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

          const threeMinData = data.filter(isBeforeSixMins);
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

          const minData = data.filter(isBeforeTwoMins);
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
