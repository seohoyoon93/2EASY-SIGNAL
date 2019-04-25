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
  timeoutSeconds: 25,
  memory: "128MB"
};

const db = admin.database();

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    let coins = [];
    let upbitBases = [];
    let coinRefs = [];

    db.ref("coins")
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
            text: `Getting coins error when updating Upbit coin price: ${err}`
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
        request.post(constants.SLACK_WEBHOOK_URL, {
          json: {
            text: `Error getting Upbit ticker when updating Upbit coin price: ${err}`
          }
        });
        console.log(err);
      });

    const prices = await upbitPrices;

    await prices.reduce(async (promise, item) => {
      let ref = coinRefs.filter(elem => elem.symbol === item.base)[0].ref;
      db.ref(ref).update({
        price: item.price,
        priceChange: item.priceChange,
        updatedAt: Date.now()
      });
    }, Promise.resolve());
    await res.send("done");
  });
