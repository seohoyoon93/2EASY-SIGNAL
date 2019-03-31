// const rp = require("request-promise");
// const $ = require("cheerio");

exports = module.exports = {};

exports.getCandleSticks = coin => {
  return new Promise((resolve, reject) => {
    const date = new Date();
    const now = date.getTime();
    const to = Math.floor(now / 60000) * 60;
    const from = Math.floor((to - 7260) / 60) * 60;

    const twoHoursAgo = to - 7200;
    const hourAgo = to - 3600;
    const thirtyMinsAgo = to - 1800;
    const fifteenMinsAgo = to - 900;
    const tenMinsAgo = to - 600;
    const sixMinsAgo = to - 360;
    const fiveMinsAgo = to - 300;
    const threeMinsAgo = to - 180;
    const twoMinsAgo = to - 120;
    const minAgo = to - 60;
    //24h volume 더하기
    let xhr24 = new XMLHttpRequest();
    let from24 = Math.floor((to - 86460) / 60) * 60;
    let lastPrice;
    let accTradeVol24h = 0.0;
    xhr24.onreadystatechange = () => {
      if (xhr24.readyState === 4 && xhr24.status === 200) {
        let parsedCoinbitHour = JSON.parse(xhr24.responseText);
        if (parsedCoinbitHour.s === "ok") {
          lastPrice = parsedCoinbitHour.c[0];
          parsedCoinbitHour.t.forEach((elem, i) => {
            accTradeVol24h =
              accTradeVol24h + parseFloat(parsedCoinbitHour.v[i]);
          });
          let xhr = new XMLHttpRequest();
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
              let parsedCoinbit = JSON.parse(xhr.responseText);
              let parsedBody = [];
              if (parsedCoinbit.s === "ok") {
                parsedCoinbit.t.forEach((elem, i) => {
                  let arr = [];
                  arr.push(elem);
                  arr.push(parsedCoinbit.o[i]);
                  arr.push(parsedCoinbit.c[i]);
                  arr.push(parsedCoinbit.h[i]);
                  arr.push(parsedCoinbit.l[i]);
                  arr.push(parsedCoinbit.v[i]);
                  parsedBody.push(arr);
                });
              }
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
                  priceChange: 0
                };

                resolve(volumeChanges, priceChanges);
              } else {
                const data = parsedBody.filter(elem => elem[0] < to);
                const hourData = data.filter(elem => elem[0] >= twoHoursAgo);
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

                const thirtyMinData = data.filter(elem => elem[0] >= hourAgo);
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

                const fifteenMinData = data.filter(
                  elem => elem[0] >= thirtyMinsAgo
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

                const fiveMinData = data.filter(elem => elem[0] >= tenMinsAgo);
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

                const threeMinData = data.filter(elem => elem[0] >= sixMinsAgo);
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

                const minData = data.filter(elem => elem[0] >= twoMinsAgo);
                let lastMinVolume = 0;
                let currentMinVolume = 0;
                let lastMinPrice = minData[0][4];
                let currentPrice = minData.reverse()[0][4];
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
                    ? (currentHourVolume / lastHourVolume) * 100 - 100
                    : 0;
                const thirtyMinVolumeChange =
                  lastThirtyMinVolume !== 0
                    ? (currentThirtyMinVolume / lastThirtyMinVolume) * 100 - 100
                    : 0;
                const fifteenMinVolumeChange =
                  lastFifteenMinVolume !== 0
                    ? (currentFifteenMinVolume / lastFifteenMinVolume) * 100 -
                      100
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
                  lastHourPrice !== 0
                    ? (currentPrice / lastHourPrice) * 100 - 100
                    : 0;
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
                  lastMinPrice !== 0
                    ? (currentPrice / lastMinPrice) * 100 - 100
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
                  priceChange: ((currentPrice - lastPrice) / lastPrice) * 100
                };
                resolve({ volumeChanges, priceChanges });
              }
            }
          };
          xhr.open(
            "GET",
            `https://cors-anywhere.herokuapp.com/https://www.coinbit.co.kr/tradingview/history/symbol-${coin}/resolution-1/from-${from}/to-${to}`
          );
          xhr.send();
        }
      }
    };
    xhr24.open(
      "GET",
      `https://cors-anywhere.herokuapp.com/https://www.coinbit.co.kr/tradingview/history/symbol-${coin}/resolution-1/from-${from24}/to-${to}`
    );
    xhr24.send();
  });
};

exports.getOrderbook = coin => {
  return new Promise((resolve, reject) => {
    // rp({
    //   method: "GET",
    //   url: `https://cors-anywhere.herokuapp.com/https://www.coinbit.co.kr/trade/order/krw-${coin}#`
    // })
    //   .then(function(html) {
    //     //success!
    //     const aggAskText = $(html)
    //       .find("div#tradeTfoot ul")
    //       .first()
    //       .text()
    //       .split(".");
    //     const aggAskInt = parseFloat(aggAskText[0].match(/\d/g).join(""));
    //     let aggAskBlah = 0;
    //     if (aggAskText.length === 2) {
    //       aggAskBlah = parseFloat("0." + aggAskText[1].match(/\d/g).join(""));
    //     }
    //     const aggAsks = aggAskInt + aggAskBlah;

    //     const aggBidsText = $(html)
    //       .find("div#tradeTfoot ul")
    //       .last()
    //       .text()
    //       .split(".");
    //     const aggBidsInt = parseFloat(aggBidsText[0].match(/\d/g).join(""));

    //     let aggBidsBlah = 0;
    //     if (aggBidsText.length === 2) {
    //       aggBidsBlah = parseFloat("0." + aggBidsText[1].match(/\d/g).join(""));
    //     }
    //     const aggBids = aggBidsInt + aggBidsBlah;

    //     const lowestAskPriceText = $(html)
    //       .find("div.trade-table.list-trademarketcost tr.blue.green")
    //       .last()
    //       .find("td.fw-500")
    //       .text()
    //       .split(".");
    //     const lowestAskPriceInt = parseFloat(
    //       lowestAskPriceText[0].match(/\d/g).join("")
    //     );
    //     let lowestAskPriceBlah = 0;
    //     if (lowestAskPriceText.length === 2) {
    //       lowestAskPriceBlah = parseFloat(
    //         "0." + lowestAskPriceText[1].match(/\d/g).join("")
    //       );
    //     }
    //     const lowestAskPrice = lowestAskPriceInt + lowestAskPriceBlah;

    //     const lowestAskQuantityText = $(html)
    //       .find("div.trade-table.list-trademarketcost tr.blue.green")
    //       .last()
    //       .find("p.graph_num_blue.graph_num_green")
    //       .text()
    //       .split(".");
    //     const lowestAskQuantityInt = parseFloat(
    //       lowestAskQuantityText[0].match(/\d/g).join("")
    //     );
    //     let lowestAskQuantityBlah = 0;
    //     if (lowestAskQuantityText.length === 2) {
    //       lowestAskQuantityBlah = parseFloat(
    //         "0." + lowestAskQuantityText[1].match(/\d/g).join("")
    //       );
    //     }
    //     const lowestAskQuantity = lowestAskQuantityInt + lowestAskQuantityBlah;

    //     const highestBidPriceText = $(html)
    //       .find("div.trade-table.list-trademarketcost tr.red")
    //       .first()
    //       .find("td.fw-500")
    //       .text()
    //       .split(".");
    //     const highestBidPriceInt = parseFloat(
    //       highestBidPriceText[0].match(/\d/g).join("")
    //     );
    //     let highestBidPriceBlah = 0;
    //     if (highestBidPriceText.length === 2) {
    //       highestBidPriceBlah = parseFloat(
    //         "0." + highestBidPriceText[1].match(/\d/g).join("")
    //       );
    //     }
    //     const highestBidPrice = highestBidPriceInt + highestBidPriceBlah;

    //     const highestBidQuantityText = $(html)
    //       .find("div.trade-table.list-trademarketcost tr.red")
    //       .first()
    //       .find("p.graph_num_red")
    //       .text()
    //       .split(".");
    //     const highestBidQuantityInt = parseFloat(
    //       highestBidQuantityText[0].match(/\d/g).join("")
    //     );
    //     let highestBidQuantityBlah = 0;
    //     if (highestBidQuantityText.length === 2) {
    //       highestBidQuantityBlah = parseFloat(
    //         "0." + highestBidQuantityText[1].match(/\d/g).join("")
    //       );
    //     }
    //     const highestBidQuantity =
    //       highestBidQuantityInt + highestBidQuantityBlah;

    //     const aggOrders = { aggAsks, aggBids };
    //     const bidAsk = {
    //       highestBidPrice,
    //       highestBidQuantity,
    //       lowestAskPrice,
    //       lowestAskQuantity
    //     };
    //     console.log(aggOrders);
    //     console.log(bidAsk);
    //     resolve({ aggOrders, bidAsk });
    //   })
    //   .catch(function(err) {
    //     console.log(err);
    //   });
    const aggOrders = { aggAsks: 0, aggBids: 0 };
    const bidAsk = {
      highestBidPrice: 0,
      highestBidQuantity: 0,
      lowestAskPrice: 0,
      lowestAskQuantity: 0
    };
    resolve({ aggOrders, bidAsk });
  });
};

exports.getTrades = coin => {
  return new Promise((resolve, reject) => {
    resolve({ aggAsks: 0, aggBids: 0 });
  });
};
