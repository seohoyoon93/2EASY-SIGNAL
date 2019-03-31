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

    const prices = await upbitPrices

    let batch = db.batch();



    await prices.reduce(async (promise, item) => {
      let ref = coinRefs.filter(elem => elem.symbol === item.base)[0].ref;

      batch.update(ref, {
        price: item.price,
        priceChange: item.priceChange,
        updatedAt: Date.now()
      })
    }, Promise.resolve())

    await batch.commit();

    await res.send("Done");
  });
