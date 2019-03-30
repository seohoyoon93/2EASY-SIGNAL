const functions = require("firebase-functions");
const admin = require("firebase-admin");
const $ = require("cheerio");
const rp = require("request-promise");
const config = functions.config().firebase;
try {
  admin.initializeApp(config);
} catch (e) {
  console.log(e);
}

const runtimeOpts = {
  timeoutSeconds: 280,
  memory: "2GB"
};

const db = admin.firestore();

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    let coins = [];
    let upbitBases = [];
    let bithumbBases = [];
    let coinbitBases = [];
    let bitsonicBases = [];
    let coinRefs = [];
    await admin
      .firestore()
      .collection("coins")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          coins.push(doc.data());
          coinRefs.push({ ref: doc.ref, symbol: doc.data().symbol });
        });
      })
      .catch(err => {
        console.log(err);
      });
    await admin
      .firestore()
      .doc("exchanges/upbit")
      .get()
      .then(doc => {
        upbitBases = doc.data().bases;
      });
    await admin
      .firestore()
      .doc("exchanges/bithumb")
      .get()
      .then(doc => {
        bithumbBases = doc.data().bases;
      });
    await admin
      .firestore()
      .doc("exchanges/coinbit")
      .get()
      .then(doc => {
        coinbitBases = doc.data().bases;
      });
    await admin
      .firestore()
      .doc("exchanges/bitsonic")
      .get()
      .then(doc => {
        bitsonicBases = doc.data().bases;
      });
    const upbitMarkets = await upbitBases.map(base => `KRW-${base}`).join(", ");

    const upbitTickerOptions = await {
      method: "GET",
      url: "https://api.upbit.com/v1/ticker",
      qs: { markets: upbitMarkets },
      json: true
    };

    let upbitPrices = [];
    await rp(upbitTickerOptions)
      .then(parsedBody => {
        parsedBody.forEach(item => {
          const price = item.trade_price;
          const priceChange = (item.signed_change_rate * 100).toFixed(2);
          const base = item.market.substring(4);
          upbitPrices.push({
            base: base,
            price: price,
            priceChange: priceChange
          });
        });
      })
      .catch(err => {
        console.log(err);
      });

    const remainingCoins = await coins
      .filter(coin => !upbitBases.includes(coin.symbol))
      .map(coin => coin.symbol);
    const bithumbMarkets = await bithumbBases.filter(base =>
      remainingCoins.includes(base)
    );

    let bithumbPrices = [];
    await bithumbMarkets.reduce(async (promise, base) => {
      await promise;
      const bithumbTickerOptions = await {
        method: "GET",
        url: `https://api.bithumb.com/public/ticker/${base}`,
        json: true
      };

      await rp(bithumbTickerOptions)
        .then(parsedBody => {
          const price = parseFloat(parsedBody.data.closing_price);
          const priceChange = parseFloat(
            parsedBody.data["24H_fluctate_rate"]
          ).toFixed(2);
          bithumbPrices.push({
            base: base,
            price: price,
            priceChange: priceChange
          });
        })
        .catch(err => {
          console.log(err);
        });
    }, Promise.resolve());
    const remainingCoins2 = await remainingCoins.filter(
      coin => !bithumbMarkets.includes(coin)
    );
    const coinbitMarkets = await coinbitBases.filter(base =>
      remainingCoins2.includes(base)
    );

    let coinbitPrices = [];
    await coinbitMarkets.reduce(async (promise, base) => {
      await promise;
      const date = new Date();
      const now = date.getTime();
      const to = Math.floor(now / 60000) * 60;
      const from = Math.floor((to - 86460) / 60) * 60;
      const coinbitTickerOptions = {
        method: "GET",
        url: `https://www.coinbit.co.kr/tradingview/history/symbol-${base}/resolution-1/from-${from}/to-${now}`,
        json: true
      };
      await rp(coinbitTickerOptions)
        .then(parsedBody => {
          const lastPrice = parsedBody.c[0];
          const price = parsedBody.c.reverse()[0];
          const priceChange = (((price - lastPrice) / lastPrice) * 100).toFixed(
            2
          );
          coinbitPrices.push({
            base: base,
            price: price,
            priceChange: priceChange
          });
        })
        .catch(err => {
          console.log(err);
        });
    }, Promise.resolve());
    const remainingCoins3 = await remainingCoins2.filter(
      coin => !coinbitMarkets.includes(coin)
    );

    const bitsonicMarkets = await bitsonicBases.filter(base =>
      remainingCoins3.includes(base)
    );
    let bitsonicPrices = [];
    await bitsonicMarkets.reduce(async (promise, base) => {
      await promise;
      const date = new Date();
      const now = date.getTime();
      const to = Math.floor(now / 60000) * 60;
      const from = Math.floor((to - 86460) / 60) * 60;
      const bitsonicOptions = {
        method: "GET",
        url: `https://api.bitsonic.co.kr/api/v2/klines?symbol=${base}KRW&interval=1h&endTime=${now}&startTime=${from}`,
        json: true
      };
      await rp(bitsonicOptions)
        .then(parsedBody => {
          const lastPrice = parseFloat(parsedBody.result.k[0].c);
          const price = parseFloat(parsedBody.result.k.reverse()[0].c);
          const priceChange = (((price - lastPrice) / lastPrice) * 100).toFixed(
            2
          );
          bitsonicPrices.push({
            base: base,
            price: price,
            priceChange: priceChange
          });
        })
        .catch(err => {
          console.log(err);
        });
    }, Promise.resolve());

    const prices = await upbitPrices.concat(
      bithumbPrices.concat(coinbitPrices.concat(bitsonicPrices))
    );

    let batch = db.batch();

    await coinRefs.reduce(async (promise, coinRef) => {
      let coin = coinRef.symbol;
      let priceObj = prices.filter(elem => elem.base === coin)[0];
      batch.update(coinRef.ref, {
        price: priceObj.price,
        priceChange: priceObj.priceChange,
        updatedAt: Date.now()
      });
    }, Promise.resolve());

    await batch.commit();

    await res.send("Done");
  });
