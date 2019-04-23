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

// const db = admin.firestore();
const db = admin.database();

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    let coins = [];
    let upbitBases = [];
    let bithumbBases = [];
    let coinRefs = [];

    // await admin
    //   .firestore()
    //   .collection("coins")
    //   .get()
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
            text: `Getting coins error when updating Bithumb coin price: ${err}`
          }
        });
        console.log(err);
      });

    // await admin
    // .firestore()
    // .doc("exchanges/upbit")
    // .get()
    await db
      .ref("exchanges/upbit")
      .once("value")
      .then(snapshot => {
        upbitBases = snapshot.val().bases;
      });

    // await admin
    //   .firestore()
    //   .doc("exchanges/bithumb")
    //   .get()
    await db
      .ref("exchanges/bithumb")
      .once("value")
      .then(snapshot => {
        bithumbBases = snapshot.val().bases;
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
          request.post(constants.SLACK_WEBHOOK_URL, {
            json: {
              text: `Error getting Bithumb ticker when updating Bithumb coin price: ${err}`
            }
          });
          console.log(err);
        });
    }, Promise.resolve());

    const prices = await bithumbPrices;

    // let batch = db.batch();

    await prices.reduce(async (promise, item) => {
      let ref = coinRefs.filter(elem => elem.symbol === item.base)[0].ref;
      db.ref(ref).update({
        price: item.price,
        priceChange: item.priceChange,
        updatedAt: Date.now()
      });

      // batch.update(ref, {
      //   price: item.price,
      //   priceChange: item.priceChange,
      //   updatedAt: Date.now()
      // });
    }, Promise.resolve());

    await res.send("done");

    // await batch
    //   .commit()
    //   .then(() => {
    //     res.send("Done");
    //   })
    //   .catch(err => {
    //     request.post(constants.SLACK_WEBHOOK_URL, {
    //       json: { text: `Error updating Bithumb coin price db writing: ${err}` }
    //     });
    //     console.log(err);
    //   });
  });
