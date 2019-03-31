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
  timeoutSeconds: 25,
  memory: "2GB"
};

const db = admin.firestore();

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    let coins = [];
    let upbitBases = [];
    let bithumbBases = [];
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

    const prices = bithumbPrices;

    let batch = db.batch();

    await prices.reduce(async (promise, item) => {
      let ref = coinRefs.filter(elem => elem.symbol === item.base)[0].ref;

      batch.update(ref, {
        price: item.price,
        priceChange: item.priceChange,
        updatedAt: Date.now()
      });
    }, Promise.resolve());

    await batch.commit();

    await res.send("Done");
  });
