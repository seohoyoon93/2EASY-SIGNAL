const functions = require("firebase-functions");
const admin = require("firebase-admin");
const request = require("request");

admin.initializeApp();

exports.setUpbitMarkets = functions.https.onRequest((req, res) => {
  request(
    {
      method: "GET",
      url: "https://api.upbit.com/v1/market/all"
    },
    (err, response, result) => {
      if (err) {
        console.log(err);
        return;
      }
      const obj = JSON.parse(result);
      const krwMarkets = obj.filter(item => item.market.includes("KRW"));
      let bases = [];
      krwMarkets.forEach(item => {
        const base = item.market.match(/\-[A-Z]\w+/)[0].match(/[A-Z]\w+/)[0];
        bases.push(base);
      });
      admin
        .firestore()
        .doc("exchanges/upbit")
        .set({
          name: "Upbit",
          link: "https://www.upbit.com",
          bases: bases
        })
        .then(() => {
          console.log("Successfully updated upbit!");
        })
        .catch(err => {
          console.error("Error updating upbit");
        });
    }
  );
});

exports.setUpbitMarketData = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .doc("exchanges/upbit")
    .get()
    .then(snapshot => {
      const data = snapshot.data();
      res.send(data.bases);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});
