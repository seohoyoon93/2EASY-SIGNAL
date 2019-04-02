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
    const bithumbFunc = {
      method: "GET",
      url:
        "https://us-central1-twoeasy-signal.cloudfunctions.net/exCoinPriceUpdateBithumb"
    };

    rp(bithumbFunc)
      .then(async parsedBody => {
        //슬립주기
        let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(28000);

        await rp(bithumbFunc)
          .then(() => {
            res.send("Done");
          })
          .catch(err => {
            request.post(constants.SLACK_WEBHOOK_URL, {
              json: {
                text: `Error calling cron job for the second time for Bithumb: ${err}`
              }
            });
            console.log(err);
          });
      })
      .catch(err => {
        request.post(constants.SLACK_WEBHOOK_URL, {
          json: {
            text: `Error calling cron job for the first time for Bithumb: ${err}`
          }
        });
        console.log(err);
      });
  });
