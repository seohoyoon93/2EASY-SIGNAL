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
  timeoutSeconds: 30,
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

    const prices = bitsonicPrices

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
