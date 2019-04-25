const functions = require("firebase-functions");
const admin = require("firebase-admin");
const rp = require("request-promise");
const request = require("request");
const constants = require("../../constants");
const config = functions.config().firebase;
try {
  admin.initializeApp(config);
} catch (e) {
  console.log(e);
}

const runtimeOpts = {
  timeoutSeconds: 30,
  memory: "128MB"
};

const db = admin.database();

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    let coins = [];
    let upbitBases = [];
    let bithumbBases = [];
    let coinbitBases = [];
    let coinRefs = [];
    await db
      .ref("coins")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          coins.push(childSnapshot.val());
          coinRefs.push({
            ref: `coins/${childSnapshot.key}`,
            symbol: childSnapshot.val().symbol
          });
        });
      })
      .catch(err => {
        request.post(constants.SLACK_WEBHOOK_URL, {
          json: {
            text: `Getting coins error when updating Coinbit coin price: ${err}`
          }
        });
        console.log(err);
      });
    await db
      .ref("exchanges/upbit")
      .once("value")
      .then(snapshot => {
        upbitBases = snapshot.val().bases;
      });
    await db
      .ref("exchanges/bithumb")
      .once("value")
      .then(snapshot => {
        bithumbBases = snapshot.val().bases;
      });
    await db
      .ref("exchanges/coinbit")
      .once("value")
      .then(snapshot => {
        coinbitBases = snapshot.val().bases;
      });

    const remainingCoins = await coins
      .filter(coin => !upbitBases.includes(coin.symbol))
      .map(coin => coin.symbol);
    const bithumbMarkets = await bithumbBases.filter(base =>
      remainingCoins.includes(base)
    );

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
          request.post(constants.SLACK_WEBHOOK_URL, {
            json: {
              text: `Error getting Coinbit orderbook when updating Coinbit coin price: ${err}`
            }
          });
          console.log(err);
        });
    }, Promise.resolve());

    const prices = await coinbitPrices;

    await prices.reduce(async (promise, item) => {
      let ref = coinRefs.filter(elem => elem.symbol === item.base)[0].ref;

      db.ref(ref).update({
        price: item.price,
        priceChange: item.priceChange,
        updatedAt: Date.now()
      });
    }, Promise.resolve());

    await res.send("Done");
  });
