const rp = require("request-promise");

exports = module.exports = {};

exports.getCandleSticks = coin => {
  return new Promise((resolve, reject) => {
    const date = new Date();
    const now = date.getTime();
    const to = Math.floor(now / 1000 / 60) * 60;
    const from = Math.floor((to - 7200) / 60) * 60;

    const twoHoursAgo = (to - 7200) * 1000;
    const hourAgo = (to - 3600) * 1000;
    const thirtyMinsAgo = (to - 1800) * 1000;
    const tenMinsAgo = (to - 600) * 1000;
    const sixMinsAgo = (to - 360) * 1000;
    const twoMinsAgo = (to - 120) * 1000;

    const tickerOptions = {
      method: "GET",
      url: `https://api.bithumb.com/public/ticker/${coin}`,
      json: true
    };

    rp(tickerOptions).then(parsedBody => {
      const accTradeVol24h = parsedBody.data.volume_1day;
      const lastPrice = parseFloat(parsedBody.data.opening_price);
      const priceChange = parseFloat(
        parsedBody.data["24H_fluctate_rate"]
      ).toFixed(2);

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
              currentPrice: lastPrice,
              priceChange
            };

            resolve(volumeChanges, priceChanges);
          } else {
            const data = parsedBody.filter(elem => elem[0] < to * 1000);
            const hourData = data.filter(elem => elem[0] >= twoHoursAgo);
            let timestamps = [];
            let time = twoHoursAgo;
            for (let i = 0; i < 120; i++) {
              timestamps.push(time);
              time += 60000;
            }
            let filledData = [];
            for (let i = 0; i < 120; i++) {
              let item = hourData.filter(
                elem => new Date(elem[0]).getTime() === timestamps[i]
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
                    price: parseFloat(item[0][2]),
                    volume: parseFloat(item[0][5])
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
                    price: parseFloat(item[0][2]),
                    volume: parseFloat(item[0][5])
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

exports.getOrderbook = coin => {
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

exports.getTrades = coin => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      uri: `https://api.bithumb.com/public/transaction_history/${coin}`,
      qs: { count: 100 },
      json: true
    };
    rp(options)
      .then(parsedBody => {
        const asks = parsedBody.data.filter(obj => obj.type === "ask");
        const bids = parsedBody.data.filter(obj => obj.type === "bid");

        let aggAsks = 0;
        asks.forEach(ask => {
          aggAsks += parseFloat(ask.total);
        });
        let aggBids = 0;
        bids.forEach(bid => {
          aggBids += parseFloat(bid.total);
        });

        resolve({ aggAsks, aggBids });
      })
      .catch(err => {
        reject("Bithumb transaction history err: ", err);
      });
  });
};
