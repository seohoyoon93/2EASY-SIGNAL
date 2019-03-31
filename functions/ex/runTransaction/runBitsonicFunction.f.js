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
  timeoutSeconds: 50,
  memory: "2GB"
};

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {

    const bitsonicFunc = await {
      method: "GET",
      url: "http://localhost:5000/twoeasy-signal/us-central1/exRunTransactionExCoinPriceBitsonic"
    };

    await rp(bitsonicFunc)
    .then(async parsedBody => {

      //슬립주기
      let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
      await sleep(28000);

      await rp(bitsonicFunc)
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