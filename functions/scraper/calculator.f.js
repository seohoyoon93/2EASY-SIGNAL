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
  const cobakPromise = getCommPromise("cobak");

  let totalText = "";
  let values = await Promise.all([
    coinpanPromise,
    cointalkPromise,
    dcinsidePromise,
    moneynetPromise,
    cobakPromise
  ]);
  totalText = await values.reduce((acc, cur) => acc + cur);
  const coins = await helper.countCoinNickname(totalText);
  const timestamp = Date.now();
  await admin
    .firestore()
    .doc(`coins/${timestamp}`)
    .set({
      mentions: coins,
      timestamp: timestamp
    })
    .then(() => {})
    .catch(err => console.log(err));
  await res.send("Done");
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
