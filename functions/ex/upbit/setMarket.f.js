const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config = functions.config().firebase;
const request = require("request");
try {
  admin.initializeApp(config);
} catch (e) {
  console.log(e);
}

exports = module.exports = functions.https.onRequest((req, res) => {
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
        .database()
        .ref("exchanges/upbit")
        .set({
          name: "Upbit",
          link: "https://www.upbit.com",
          bases: bases
        })
        .then(() => {
          console.log("Successfully updated upbit!");
          res.send("Done!");
        })
        .catch(err => {
          console.error("Error updating upbit");
          res.status(500).send(err);
        });
    }
  );
});
