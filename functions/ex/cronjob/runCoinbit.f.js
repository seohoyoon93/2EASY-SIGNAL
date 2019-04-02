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
  timeoutSeconds: 60
};

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest((req, res) => {
    const coinbitFunc = {
      method: "GET",
      url:
        "https://us-central1-twoeasy-signal.cloudfunctions.net/exCoinPriceUpdateCoinbit"
    };

    rp(coinbitFunc)
      .then(async parsedBody => {
        //슬립주기
        let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(28000);

        await rp(coinbitFunc)
          .then(() => {
            res.send("Done");
          })
          .catch(err => {
            request.post(constants.SLACK_WEBHOOK_URL, {
              json: {
                text: `Error calling cron job for the second time for Coinbit: ${err}`
              }
            });
            console.log(err);
          });
      })
      .catch(err => {
        request.post(constants.SLACK_WEBHOOK_URL, {
          json: {
            text: `Error calling cron job for the first time for Coinbit: ${err}`
          }
        });
        console.log(err);
      });
  });
