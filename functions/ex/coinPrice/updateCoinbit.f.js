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

const db = admin.firestore();

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    let coins = [];
    let upbitBases = [];
    let bithumbBases = [];
    let coinbitBases = [];
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
        request.post(constants.SLACK_WEBHOOK_URL, {
          json: {
            text: `Getting coins error when updating Coinbit coin price: ${err}`
          }
        });
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

    const prices = coinbitPrices;

    let batch = db.batch();

    await prices.reduce(async (promise, item) => {
      let ref = coinRefs.filter(elem => elem.symbol === item.base)[0].ref;

      batch.update(ref, {
        price: item.price,
        priceChange: item.priceChange,
        updatedAt: Date.now()
      });
    }, Promise.resolve());

    await batch
      .commit()
      .then(() => res.send("Done"))
      .catch(err => {
        request.post(constants.SLACK_WEBHOOK_URL, {
          json: { text: `Error updating Coinbit coin price db writing: ${err}` }
        });
        console.log(err);
      });
  });
