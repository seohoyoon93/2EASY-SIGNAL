const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config = functions.config().firebase;
const request = require("request");
const constants = require("../../constants");
try {
  admin.initializeApp(config);
} catch (e) {
  console.log(e);
}

exports = module.exports = functions.https.onRequest((req, res) => {
  const bases = [
    "DEX",
    "DXR",
    "DXG",
    "BLINK",
    "BTC",
    "ETH",
    "BCH",
    "BSV",
    "LTC",
    "ETC",
    "QTUM",
    "NEXO",
    "XTX",
    "GRS",
    "LRC",
    "THETA",
    "ARDR",
    "NXT",
    "IGNIS",
    "ELF",
    "ZRX",
    "KIN",
    "APIS",
    "ROMTV",
    "NET",
    "MXM",
    "ENJ",
    "R",
    "PAX",
    "TUSD",
    "BTG",
    "SNT",
    "OMG",
    "EDR"
  ];
  admin
    .database()
    .ref("exchanges/coinbit")
    .set({
      name: "Coinbit",
      link: "https://www.coinbit.co.kr",
      bases: bases
    })
    .then(() => {
      console.log("realtime db update for coinbit");
      res.send("Done");
    })
    .catch(err => {
      console.error("Error updating coinbit");
      res.status(500).send(err);
    });
  // admin
  //   .firestore()
  //   .doc("exchanges/coinbit")
  //   .set({
  //     name: "Coinbit",
  //     link: "https://www.coinbit.co.kr",
  //     bases: bases
  //   })
  //   .then(() => {
  //     console.log("Successfully updated coinbit!");
  //     res.send("Done");
  //   })
  //   .catch(err => {
  //     request.post(constants.SLACK_WEBHOOK_URL, {
  //       json: { text: `Coinbit set market db writing error: ${err}` }
  //     });
  //     console.error("Error updating coinbit");
  //     res.status(500).send(err);
  //   });
});
