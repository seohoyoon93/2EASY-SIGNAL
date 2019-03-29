const rp = require("request-promise");

exports = module.exports = {};

exports.getCandleSticks = coin => {
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

            // time, open, close, high, low, volume 순서로 elem 수정 필요

            const hourData = parsedBody.filter(elem => elem[0] > twoHoursAgo);
            let lastHourVolume = 0;
            let currentHourVolume = 0;
            let lastHourPrice = hourData[0][2];
            hourData.forEach(elem => {
              if (elem[0] < hourAgo) {
                lastHourVolume += parseFloat(elem[5]);
                lastHourPrice = parseFloat(elem[2]);
              } else {
                currentHourVolume += parseFloat(elem[5]);
              }
            });

            const thirtyMinData = parsedBody.filter(elem => elem[0] > hourAgo);
            let lastThirtyMinVolume = 0;
            let currentThirtyMinVolume = 0;
            let lastThirtyMinPrice = hourData[0][2];
            thirtyMinData.forEach(elem => {
              if (elem[0] < thirtyMinsAgo) {
                lastThirtyMinVolume += parseFloat(elem[5]);
                lastThirtyMinPrice = parseFloat(elem[2]);
              } else {
                currentThirtyMinVolume += parseFloat(elem[5]);
              }
            });

            const fifteenMinData = parsedBody.filter(
              elem => elem[0] > thirtyMinsAgo
            );
            let lastFifteenMinVolume = 0;
            let currentFifteenMinVolume = 0;
            let lastFifteenMinPrice = hourData[0][2];
            fifteenMinData.forEach(elem => {
              if (elem[0] < fifteenMinsAgo) {
                lastFifteenMinVolume += parseFloat(elem[5]);
                lastFifteenMinPrice = parseFloat(elem[2]);
              } else {
                currentFifteenMinVolume += parseFloat(elem[5]);
              }
            });

            const fiveMinData = parsedBody.filter(elem => elem[0] > tenMinsAgo);
            let lastFiveMinVolume = 0;
            let currentFiveMinVolume = 0;
            let lastFiveMinPrice = hourData[0][2];
            fiveMinData.forEach(elem => {
              if (elem[0] < fiveMinsAgo) {
                lastFiveMinVolume += parseFloat(elem[5]);
                lastFiveMinPrice = parseFloat(elem[2]);
              } else {
                currentFiveMinVolume += parseFloat(elem[5]);
              }
            });

            const threeMinData = parsedBody.filter(
              elem => elem[0] > sixMinsAgo
            );
            let lastThreeMinVolume = 0;
            let currentThreeMinVolume = 0;
            let lastThreeMinPrice = hourData[0][2];
            threeMinData.forEach(elem => {
              if (elem[0] < threeMinsAgo) {
                lastThreeMinVolume += parseFloat(elem[5]);
                lastThreeMinPrice = parseFloat(elem[2]);
              } else {
                currentThreeMinVolume += parseFloat(elem[5]);
              }
            });

            const minData = parsedBody.filter(elem => elem[0] > twoMinsAgo);
            let lastMinVolume = 0;
            let currentMinVolume = 0;
            let lastMinPrice = hourData[0][2];
            let currentPrice = hourData.reverse()[0][2];
            minData.forEach(elem => {
              if (elem[0] < minAgo) {
                lastMinVolume += parseFloat(elem[5]);
                lastMinPrice = parseFloat(elem[2]);
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
