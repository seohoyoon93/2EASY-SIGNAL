const functions = require("firebase-functions");
const admin = require("firebase-admin");
const request = require("request");
const constants = require("../constants");
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
  const bitmanPromise = getCommPromise("bitman");
  const bitokaPromise = getCommPromise("bitoka");
  const coinplanetPromise = getCommPromise("coinplanet");

  let totalText = "";
  let values = await Promise.all([
    coinpanPromise,
    cointalkPromise,
    dcinsidePromise,
    moneynetPromise,
    cobakPromise,
    bitmanPromise,
    bitokaPromise,
    coinplanetPromise
  ]);
  totalText = await values.reduce((acc, cur) => acc + " " + cur);
  const coins = await helper.countCoinNickname(totalText);
  const timestamp = Date.now();
  await admin
    .firestore()
    .doc(`mentions/${timestamp}`)
    .set({
      mentions: coins,
      timestamp: timestamp
    })
    .then(() => {})
    .catch(err => console.log(err));
  await request.post(constants.SLACK_WEBHOOK_URL, {
    json: { text: `Success on scraper calculator!` }
  });
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
            doc.data().title +
            " " +
            doc.data().content +
            " " +
            doc.data().comments;
          result += " " + text;
        });
        resolve(result);
      })
      .catch(err => {
        request.post(constants.SLACK_WEBHOOK_URL, {
          json: {
            text: `Error on scraper calculator when getting db data: ${err}`
          }
        });
        reject(err);
      });
  });
}
