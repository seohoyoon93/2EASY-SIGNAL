const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config = functions.config().firebase;
const helper = require("./helper");

try {
  admin.initializeApp(config);
} catch (e) {
  console.log(e);
}
exports = module.exports = functions.https.onRequest(async (req, res) => {
  const coinpanPromise = getCommPromise("coinpan");
  const cointalkPromise = getCommPromise("cointalk");
  const dcinsidePromise = getCommPromise("dcinside");
  const moneynetPromise = getCommPromise("moneynet");

  let totalText = "";
  await Promise.all([
    coinpanPromise,
    cointalkPromise,
    dcinsidePromise,
    moneynetPromise
  ])
    .then(values => {
      totalText += values.reduce((acc, cur) => acc + cur);

      const coins = helper.countCoinNickname(totalText);
      Object.keys(coins).forEach(coin => {
        admin
          .firestore()
          .doc(`coins/${coin}`)
          .set({
            count: coins[coin]
          })
          .then(() => {
            console.log("Updated coin counts, ", coins);
            res.send("Done");
          })
          .catch(err => {
            console.log(err);
          });
      });
    })
    .catch(err => {
      console.log(err);
    });
});

function getCommPromise(community) {
  const thirtyMinAgo = Date.now() - 1800000;

  return new Promise((resolve, reject) => {
    admin
      .firestore()
      .collection(`communities/${community}/data/`)
      .where("timestamp", ">=", thirtyMinAgo)
      .get()
      .then(querySnapshot => {
        let result = "";
        querySnapshot.forEach(doc => {
          const text =
            doc.data().title + doc.data().content + doc.data().comments;
          result += text;
        });
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
}
