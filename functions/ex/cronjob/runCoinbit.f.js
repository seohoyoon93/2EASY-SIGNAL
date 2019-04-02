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
  timeoutSeconds: 60,
  memory: "2GB"
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
          .then(parsedBody => {
            res.send("Done");
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  });
