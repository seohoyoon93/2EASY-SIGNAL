const functions = require("firebase-functions");
const admin = require("firebase-admin");
const rp = require("request-promise");
const request = require("request");
const constants = require("../../constants");
const config = functions.config().firebase;
const apikey = require("../../config/bitsonic_api_key");
try {
  admin.initializeApp(config);
} catch (e) {
  console.log(e);
}

const runtimeOpts = {
  timeoutSeconds: 60,
  memory: "256MB"
};

// const db = admin.firestore();
const db = admin.database();

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    let coins = [];
    let upbitBases = [];
    let bithumbBases = [];
    let coinbitBases = [];
    let bitsonicBases = [];
    let coinRefs = [];
    // await admin
    //   .firestore()
    //   .collection("coins")
    //   .get()
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
            text: `Getting coins error when updating Bitsonic coin price: ${err}`
          }
        });
        console.log(err);
      });
    // await admin
    //   .firestore()
    //   .doc("exchanges/upbit")
    //   .get()
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
    // await admin
    //   .firestore()
    //   .doc("exchanges/coinbit")
    //   .get()
    await db
      .ref("exchanges/coinbit")
      .once("value")
      .then(snapshot => {
        coinbitBases = snapshot.val().bases;
      });
    // await admin
    //   .firestore()
    //   .doc("exchanges/bitsonic")
    //   .get()
    await db
      .ref("exchanges/bitsonic")
      .once("value")
      .then(snapshot => {
        bitsonicBases = snapshot.val().bases;
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

    const remainingCoins3 = await remainingCoins2.filter(
      coin => !coinbitMarkets.includes(coin)
    );

    const bitsonicMarkets = await bitsonicBases.filter(base =>
      remainingCoins3.includes(base)
    );

    let bitsonicPrices = [];
    await bitsonicMarkets.reduce(async (promise, base) => {
      await promise;
      // const date = new Date();
      // const now = date.getTime();
      // const to = Math.floor(now / 60000) * 60;
      // const from = Math.floor((to - 86460) / 60) * 60;
      let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
      await sleep(200);
      const bitsonicOptions = await {
        method: "GET",
        url: `https://open-api.bitsonic.co.kr/api/v1/ticker/24hr?symbol=${base.toLowerCase()}krw&api_key=${
          apikey.BITSONIC_API_KEY
        }`,
        json: true
      };
      await rp(bitsonicOptions)
        .then(parsedBody => {
          const price = parseFloat(parsedBody.result.c);
          const priceChange = parseFloat(parsedBody.result.P).toFixed(2);
          bitsonicPrices.push({
            base: base,
            price: price,
            priceChange: priceChange
          });
        })
        .catch(err => {
          request.post(constants.SLACK_WEBHOOK_URL, {
            json: {
              text: `Error getting Bitsonic orderbook when updating bitsonic coin price: ${err}`
            }
          });
          console.log(err);
        });
    }, Promise.resolve());

    const prices = await bitsonicPrices;

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

    // await batch
    //   .commit()
    //   .then(() => {
    //     res.send("Done");
    //   })
    //   .catch(err => {
    //     request.post(constants.SLACK_WEBHOOK_URL, {
    //       json: {
    //         text: `Error updating Bitsonic coin price db writing: ${err}`
    //       }
    //     });
    //     console.log(err);
    //   });
    await res.send("done");
  });
