const rp = require("request-promise");

exports = module.exports = {};

exports.getCandleSticks = coin => {
  return new Promise((resolve, reject) => {
    const now = Math.floor(new Date() / 60000) * 60000;
    const nowHour = Math.floor(new Date() / 3600000) * 3600000;
    const twoDaysAgo = nowHour - 172800000;
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
    function isBeforeTwoDays(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime >= twoDaysAgo;
    }
    function notThisHour(data) {
      const candleTime = new Date(data.candle_date_time_kst).getTime();

      return candleTime < nowHour;
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

    const hourCandleOptions = {
      method: "GET",
      url: "https://api.upbit.com/v1/candles/minutes/60",
      qs: { market: `KRW-${coin}`, count: "49" },
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
      const openPrice = parsedBody[0].opening_price;
      const priceChange = parsedBody[0].signed_change_rate * 100;

      rp(candleOptions).then(parsedBody => {
        const candleData = parsedBody.filter(notRightNow);
        const minData = candleData.filter(isBeforeTwoHours);
        let timestamps = [];
        let time = twoHoursAgo;
        for (let i = 0; i < 120; i++) {
          timestamps.push(time);
          time += 60000;
        }
        let filledMinData = [];
        for (let i = 0; i < 120; i++) {
          let item = minData.filter(
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
                price: filledMinData[i - 1].price,
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
          filledMinData.push(candle);
        }

        let lastHourVolume = 0;
        let currentHourVolume = 0;
        let lastHourPrice = filledMinData[60].price;
        for (let i = 0; i < 120; i++) {
          if (i < 60) {
            lastHourVolume += filledMinData[i].volume;
          } else {
            currentHourVolume += filledMinData[i].volume;
          }
        }

        const thirtyMinData = filledMinData.filter(
          elem => elem.timestamp >= hourAgo
        );
        let lastThirtyMinVolume = 0;
        let currentThirtyMinVolume = 0;
        let lastThirtyMinPrice = thirtyMinData[30].price;
        for (let i = 0; i < 60; i++) {
          if (i < 30) {
            lastThirtyMinVolume += filledMinData[i].volume;
          } else {
            currentThirtyMinVolume += filledMinData[i].volume;
          }
        }

        const fifteenMinData = filledMinData.filter(
          elem => elem.timestamp >= thirtyMinsAgo
        );
        let lastFifteenMinVolume = 0;
        let currentFifteenMinVolume = 0;
        let lastFifteenMinPrice = fifteenMinData[15].price;
        for (let i = 0; i < 30; i++) {
          if (i < 15) {
            lastFifteenMinVolume += filledMinData[i].volume;
          } else {
            currentFifteenMinVolume += filledMinData[i].volume;
          }
        }

        const fiveMinData = filledMinData.filter(
          elem => elem.timestamp >= tenMinsAgo
        );
        let lastFiveMinVolume = 0;
        let currentFiveMinVolume = 0;
        let lastFiveMinPrice = fiveMinData[5].price;
        for (let i = 0; i < 10; i++) {
          if (i < 5) {
            lastFiveMinVolume += filledMinData[i].volume;
          } else {
            currentFiveMinVolume += filledMinData[i].volume;
          }
        }

        const threeMinData = filledMinData.filter(
          elem => elem.timestamp >= sixMinsAgo
        );
        let lastThreeMinVolume = 0;
        let currentThreeMinVolume = 0;
        let lastThreeMinPrice = threeMinData[3].price;
        for (let i = 0; i < 6; i++) {
          if (i < 3) {
            lastThreeMinVolume += filledMinData[i].volume;
          } else {
            currentThreeMinVolume += filledMinData[i].volume;
          }
        }

        const oneMinData = filledMinData.filter(
          elem => elem.timestamp >= twoMinsAgo
        );
        let lastMinVolume = oneMinData[0].volume;
        let currentMinVolume = oneMinData[1].volume;
        let lastMinPrice = oneMinData[0].price;
        let currentPrice = oneMinData[1].price;

        const hourVolumeChange =
          lastHourVolume !== 0
            ? (currentHourVolume / lastHourVolume) * 100 - 100
            : 0;
        const thirtyMinVolumeChange =
          lastThirtyMinVolume !== 0
            ? (currentThirtyMinVolume / lastThirtyMinVolume) * 100 - 100
            : 0;
        const fifteenMinVolumeChange =
          lastFifteenMinVolume !== 0
            ? (currentFifteenMinVolume / lastFifteenMinVolume) * 100 - 100
            : 0;
        const fiveMinVolumeChange =
          lastFiveMinVolume !== 0
            ? (currentFiveMinVolume / lastFiveMinVolume) * 100 - 100
            : 0;
        const threeMinVolumeChange =
          lastThreeMinVolume !== 0
            ? (currentThreeMinVolume / lastThreeMinVolume) * 100 - 100
            : 0;
        const minVolumeChange =
          lastMinVolume !== 0
            ? (currentMinVolume / lastMinVolume) * 100 - 100
            : 0;

        const hourPriceChange =
          lastHourPrice !== 0 ? (currentPrice / lastHourPrice) * 100 - 100 : 0;
        const thirtyMinPriceChange =
          lastThirtyMinPrice !== 0
            ? (currentPrice / lastThirtyMinPrice) * 100 - 100
            : 0;

        const fifteenMinPriceChange =
          lastFifteenMinPrice !== 0
            ? (currentPrice / lastFifteenMinPrice) * 100 - 100
            : 0;

        const fiveMinPriceChange =
          lastFiveMinPrice !== 0
            ? (currentPrice / lastFiveMinPrice) * 100 - 100
            : 0;
        const threeMinPriceChange =
          lastThreeMinPrice !== 0
            ? (currentPrice / lastThreeMinPrice) * 100 - 100
            : 0;
        const minPriceChange =
          lastMinPrice !== 0 ? (currentPrice / lastMinPrice) * 100 - 100 : 0;

        rp(hourCandleOptions).then(parsedBody => {
          const hourCandleData = parsedBody.filter(notThisHour);
          const hourData = hourCandleData.filter(isBeforeTwoDays);
          let hourstamps = [];
          let hour = twoDaysAgo;
          for (let i = 0; i < 48; i++) {
            hourstamps.push(hour);
            hour += 3600000;
          }
          let filledHourData = [];
          for (let i = 0; i < 48; i++) {
            let item = hourData.filter(
              elem =>
                new Date(elem.candle_date_time_kst).getTime() === hourstamps[i]
            );
            let candle;
            if (i === 0) {
              if (item === undefined || item.length === 0) {
                candle = {
                  timestamp: hourstamps[i],
                  price: openPrice,
                  volume: 0
                };
              } else {
                candle = {
                  timestamp: hourstamps[i],
                  price: item[0].trade_price,
                  volume: item[0].candle_acc_trade_price
                };
              }
            } else {
              if (item === undefined || item.length === 0) {
                candle = {
                  timestamp: hourstamps[i],
                  price: filledHourData[i - 1].price,
                  volume: 0
                };
              } else {
                candle = {
                  timestamp: hourstamps[i],
                  price: item[0].trade_price,
                  volume: item[0].candle_acc_trade_price
                };
              }
            }
            filledHourData.push(candle);
          }
          let lastFourHourVol = 0;
          let currentFourHourVol = 0;
          let lastFourHourPrice = filledHourData[44].price;
          for (let i = 0; i < 8; i++) {
            if (i < 4) {
              lastFourHourVol += filledHourData[i + 40].volume;
            } else {
              currentFourHourVol += filledHourData[i + 40].volume;
            }
          }
          let lastDayVol = 0;
          let todayVol = 0;
          let lastDayPrice = filledHourData[24].price;
          for (let i = 0; i < 48; i++) {
            if (i < 24) {
              lastDayVol += filledHourData[i].volume;
            } else {
              todayVol += filledHourData[i].volume;
            }
          }
          const dayVolumeChange =
            lastDayVol !== 0 ? (todayVol / lastDayVol) * 100 - 100 : 0;

          const fourHourVolumeChange =
            lastFourHourVol !== 0
              ? (currentFourHourVol / lastFourHourVol) * 100 - 100
              : 0;
          const dayPriceChange =
            lastDayPrice !== 0 ? (currentPrice / lastDayPrice) * 100 - 100 : 0;

          const fourHourPriceChange =
            lastFourHourPrice !== 0
              ? (currentPrice / lastFourHourPrice) * 100 - 100
              : 0;

          const volumeChanges = {
            accTradeVol24h,
            dayVolumeChange,
            fourHourVolumeChange,
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
            dayPriceChange,
            fourHourPriceChange,
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
        });
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
