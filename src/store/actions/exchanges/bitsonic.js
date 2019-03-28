const rp = require("request-promise");
const $ = require("cheerio");

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

    rp({
      method: "GET",
      url: `https://cors-anywhere.herokuapp.com/https://bitsonic.co.kr/front/exchange/${coin}-krw`
    })
      .then(function(html) {
        //success!

        const accTradeVol24hText = $(html)
          .find("div.coin-text-group div.coin-text-item")
          .last()
          .find("p")
          .text()
          .split(".");
        const accTradeVol24hInt = parseFloat(
          accTradeVol24hText[0].match(/\d/g).join("")
        );
        let accTradeVol24hBlah = 0;
        if (accTradeVol24hText.length === 2) {
          accTradeVol24hBlah = parseFloat(
            "0." + accTradeVol24hText[1].match(/\d/g).join("")
          );
        }
        const accTradeVol24h = accTradeVol24hInt + accTradeVol24hBlah;

        const lastPriceText = $(html)
          .find("h3.coin-price-title")
          .text()
          .split(".");
        const lastPriceInt = parseFloat(lastPriceText[0].match(/\d/g).join(""));
        let lastPriceBlah = 0;
        if (lastPriceText.length === 2) {
          lastPriceBlah = parseFloat(
            "0." + lastPriceText[1].match(/\d/g).join("")
          );
        }

        const lastPrice = lastPriceInt + lastPriceBlah;

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            let parsedBody = response.result.k;

            const hourData = parsedBody.filter(elem => elem.T > twoHoursAgo);
            let lastHourVolume = 0;
            let currentHourVolume = 0;
            let lastHourPrice = hourData.reverse()[0].c;
            hourData.forEach(elem => {
              if (elem.T < hourAgo) {
                lastHourVolume += parseFloat(elem.q);
                lastHourPrice = parseFloat(elem.c);
              } else {
                currentHourVolume += parseFloat(elem.q);
              }
            });

            const thirtyMinData = parsedBody.filter(elem => elem.T > hourAgo);
            let lastThirtyMinVolume = 0;
            let currentThirtyMinVolume = 0;
            let lastThirtyMinPrice = thirtyMinData.reverse()[0].c;
            thirtyMinData.forEach(elem => {
              if (elem.T < thirtyMinsAgo) {
                lastThirtyMinVolume += parseFloat(elem.q);
                lastThirtyMinPrice = parseFloat(elem.c);
              } else {
                currentThirtyMinVolume += parseFloat(elem.q);
              }
            });

            const fifteenMinData = parsedBody.filter(
              elem => elem.T > thirtyMinsAgo
            );
            let lastFifteenMinVolume = 0;
            let currentFifteenMinVolume = 0;
            let lastFifteenMinPrice = fifteenMinData.reverse()[0].c;
            fifteenMinData.forEach(elem => {
              if (elem.T < fifteenMinsAgo) {
                lastFifteenMinVolume += parseFloat(elem.q);
                lastFifteenMinPrice = parseFloat(elem.c);
              } else {
                currentFifteenMinVolume += parseFloat(elem.q);
              }
            });

            const fiveMinData = parsedBody.filter(elem => elem.T > tenMinsAgo);
            let lastFiveMinVolume = 0;
            let currentFiveMinVolume = 0;
            let lastFiveMinPrice = fiveMinData.reverse()[0].c;
            fiveMinData.forEach(elem => {
              if (elem.T < fiveMinsAgo) {
                lastFiveMinVolume += parseFloat(elem.q);
                lastFiveMinPrice = parseFloat(elem.c);
              } else {
                currentFiveMinVolume += parseFloat(elem.q);
              }
            });

            const threeMinData = parsedBody.filter(elem => elem.T > sixMinsAgo);
            let lastThreeMinVolume = 0;
            let currentThreeMinVolume = 0;
            let lastThreeMinPrice = threeMinData.reverse()[0].c;
            threeMinData.forEach(elem => {
              if (elem.T < threeMinsAgo) {
                lastThreeMinVolume += parseFloat(elem.q);
                lastThreeMinPrice = parseFloat(elem.c);
              } else {
                currentThreeMinVolume += parseFloat(elem.q);
              }
            });

            const minData = parsedBody.filter(elem => elem.T > twoMinsAgo);
            let lastMinVolume = 0;
            let currentMinVolume = 0;
            let lastMinPrice = minData.reverse()[0].c;
            minData.forEach(elem => {
              if (elem.T < minAgo) {
                lastMinVolume += parseFloat(elem.q);
                lastMinPrice = parseFloat(elem.c);
              } else {
                currentMinVolume += parseFloat(elem.q);
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
                ? ((lastPrice / lastHourPrice) * 100 - 100).toFixed(2)
                : 0;
            const thirtyMinPriceChange =
              lastThirtyMinPrice !== 0
                ? ((lastPrice / lastThirtyMinPrice) * 100 - 100).toFixed(2)
                : 0;
            const fifteenMinPriceChange =
              lastFifteenMinPrice !== 0
                ? ((lastPrice / lastFifteenMinPrice) * 100 - 100).toFixed(2)
                : 0;
            const fiveMinPriceChange =
              lastFiveMinPrice !== 0
                ? ((lastPrice / lastFiveMinPrice) * 100 - 100).toFixed(2)
                : 0;
            const threeMinPriceChange =
              lastThreeMinPrice !== 0
                ? ((lastPrice / lastThreeMinPrice) * 100 - 100).toFixed(2)
                : 0;
            const minPriceChange =
              lastMinPrice !== 0
                ? ((lastPrice / lastMinPrice) * 100 - 100).toFixed(2)
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
              currentPrice: lastPrice
            };
            resolve({ volumeChanges, priceChanges });
          }
        };
        xhr.open(
          "GET",
          `https://cors-anywhere.herokuapp.com/https://api.bitsonic.co.kr/api/v2/klines?symbol=${coin}KRW&interval=1m&endTime=${to}&startTime=${from}`
        );
        xhr.send();
      })
      .catch(function(err) {
        console.log(err);
      });
  });
};

exports.getOrderbook = coin => {
  return new Promise((resolve, reject) => {
    rp({
      method: "GET",
      url: `https://cors-anywhere.herokuapp.com/https://bitsonic.co.kr/front/exchange/${coin}-krw`
    })
      .then(function(html) {
        //success!
        const aggAskText = $(html)
          .find("div#stickyOrderbook div.orderbook-header.orderbook-header-top")
          .children()
          .last()
          .find("p.text-blue")
          .text()
          .split(".");
        const aggAskInt = parseFloat(aggAskText[0].match(/\d/g).join(""));
        let aggAskBlah = 0;
        if (aggAskText.length === 2) {
          aggAskBlah = parseFloat("0." + aggAskText[1].match(/\d/g).join(""));
        }
        const aggAsks = aggAskInt + aggAskBlah;

        const aggBidsText = $(html)
          .find(
            "div#stickyOrderbook div.orderbook-header.orderbook-header-bottom"
          )
          .children()
          .last()
          .find("p.text-pink")
          .text()
          .split(".");
        const aggBidsInt = parseFloat(aggBidsText[0].match(/\d/g).join(""));
        let aggBidsBlah = 0;
        if (aggBidsText.length === 2) {
          aggBidsBlah = parseFloat("0." + aggBidsText[1].match(/\d/g).join(""));
        }
        const aggBids = aggBidsInt + aggBidsBlah;

        const lowestAskPriceText = $(html)
          .find("ul.orderbook-flex-list.blue")
          .last()
          .children()
          .eq(1)
          .find("span")
          .text()
          .split(".");
        const lowestAskPriceInt = parseFloat(
          lowestAskPriceText[0].match(/\d/g).join("")
        );
        let lowestAskPriceBlah = 0;
        if (lowestAskPriceText.length === 2) {
          lowestAskPriceBlah = parseFloat(
            "0." + lowestAskPriceText[1].match(/\d/g).join("")
          );
        }
        const lowestAskPrice = lowestAskPriceInt + lowestAskPriceBlah;

        const lowestAskQuantityText = $(html)
          .find("ul.orderbook-flex-list.blue")
          .last()
          .children()
          .last()
          .find("span")
          .text()
          .split(".");
        const lowestAskQuantityInt = parseFloat(
          lowestAskQuantityText[0].match(/\d/g).join("")
        );
        let lowestAskQuantityBlah = 0;
        if (lowestAskQuantityText.length === 2) {
          lowestAskQuantityBlah = parseFloat(
            "0." + lowestAskQuantityText[1].match(/\d/g).join("")
          );
        }
        const lowestAskQuantity = lowestAskQuantityInt + lowestAskQuantityBlah;

        const highestBidPriceText = $(html)
          .find("ul.orderbook-flex-list.pink")
          .first()
          .children()
          .eq(1)
          .find("span")
          .text()
          .split(".");
        const highestBidPriceInt = parseFloat(
          highestBidPriceText[0].match(/\d/g).join("")
        );
        let highestBidPriceBlah = 0;
        if (highestBidPriceText.length === 2) {
          highestBidPriceBlah = parseFloat(
            "0." + highestBidPriceText[1].match(/\d/g).join("")
          );
        }
        const highestBidPrice = highestBidPriceInt + highestBidPriceBlah;

        const highestBidQuantityText = $(html)
          .find("ul.orderbook-flex-list.pink")
          .first()
          .children()
          .last()
          .find("span")
          .text()
          .split(".");
        const highestBidQuantityInt = parseFloat(
          highestBidQuantityText[0].match(/\d/g).join("")
        );
        let highestBidQuantityBlah = 0;
        if (highestBidQuantityText.length === 2) {
          highestBidQuantityBlah = parseFloat(
            "0." + highestBidQuantityText[1].match(/\d/g).join("")
          );
        }
        const highestBidQuantity =
          highestBidQuantityInt + highestBidQuantityBlah;

        const aggOrders = { aggAsks, aggBids };
        const bidAsk = {
          highestBidPrice,
          highestBidQuantity,
          lowestAskPrice,
          lowestAskQuantity
        };
        resolve({ aggOrders, bidAsk });
      })
      .catch(function(err) {
        console.log(err);
      });
  });
};

exports.getTrades = coin => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: `https://cors-anywhere.herokuapp.com/https://bitsonic.co.kr/front/exchange/${coin}-krw`
    };

    rp(options)
      .then(html => {
        const tradeTable = $(
          "div.center-flex-table.history-time div.scrollbar-y",
          html
        );
        let asks = [];
        let bids = [];
        tradeTable.children().each((i, elem) => {
          if ($(elem).find("p.text-pink").length > 0) {
            bids.push(
              parseInt(
                $(elem)
                  .find(".table-item")
                  .last()
                  .text()
                  .match(/\d/g)
                  .join("")
              )
            );
          } else {
            asks.push(
              parseInt(
                $(elem)
                  .find(".table-item")
                  .last()
                  .text()
                  .match(/\d/g)
                  .join("")
              )
            );
          }
        });
        const aggAsks = asks.reduce((acc, cur) => acc + cur);
        const aggBids = bids.reduce((acc, cur) => acc + cur);
        resolve({ aggAsks, aggBids });
      })
      .catch(err => {
        reject("Bitsonic trade history err: ", err);
      });
  });
};
