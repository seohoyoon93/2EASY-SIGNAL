const functions = require("firebase-functions");
const admin = require("firebase-admin");
const request = require("request");

admin.initializeApp();

Date.prototype.getUnixTime = function() {
  return (this.getTime() / 1000) | 0;
};

Array.prototype.delayedForEach = function(callback, timeout, thisArg) {
  var i = 0,
    l = this.length,
    self = this,
    caller = function() {
      callback.call(thisArg || self, self[i], i, self);
      ++i < l && setTimeout(caller, timeout);
    };
  caller();
};

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
          res.send("Done!");
        })
        .catch(err => {
          console.error("Error updating upbit");
          res.status(500).send(err);
        });
    }
  );
});

exports.setBithumbMarkets = functions.https.onRequest((req, res) => {
  request(
    {
      method: "GET",
      url: "https://api.bithumb.com/public/ticker/ALL"
    },
    (err, response, result) => {
      if (err) {
        console.log(err);
        return;
      }
      const obj = JSON.parse(result);
      const bases = Object.keys(obj.data);
      admin
        .firestore()
        .doc("exchanges/bithumb")
        .set({
          name: "Bithumb",
          link: "https://www.bithumb.com/",
          bases: bases
        })
        .then(() => {
          console.log("Successfully updated bithumb!");
          res.send("Done!");
        })
        .catch(err => {
          console.error("Error updating bithumb");
          res.status(500).send(err);
        });
    }
  );
});

exports.setUpbitMarketData = functions.https.onRequest((req, res) => {
  let count = 0;
  let length;
  admin
    .firestore()
    .doc("exchanges/upbit")
    .get()
    .then(snapshot => {
      const data = snapshot.data();
      length = data.bases.length;
      data.bases.delayedForEach(
        (base, index, array) => {
          const now = new Date();
          const options = {
            method: "GET",
            url: "https://api.upbit.com/v1/candles/minutes/1",
            qs: { market: `KRW-${base}`, count: "2" }
          };

          request(options, (err, response, result) => {
            if (err) {
              console.log(err);
              return;
            }
            const obj = JSON.parse(result);
            const currentData = obj[0];
            const lastData = obj[1];

            //currentData saving
            const currentCandleTime = Math.floor(a / 60000) * 60000;
            const lastCandleTime = currentCandleTime - 60000;

            const currentStartTime =
              new Date(currentData.candle_date_time_utc).getUnixTime() * 1000;
            //lastData to update
            const lastStartTime =
              new Date(lastData.candle_date_time_utc).getUnixTime() * 1000;

            admin
              .firestore()
              .doc(
                `exchanges/upbit/KRW-${base}/${
                  currentData.candle_date_time_utc
                }`
              )
              .set({
                startTime: currentStartTime,
                endTime: currentData.timestamp,
                price: currentData.trade_price,
                volume: currentData.candle_acc_trade_price
              })
              .then(() => {
                console.log(
                  "New data updated for KRW-",
                  base,
                  " market of Upbit"
                );
                if (++count == length * 2) {
                  console.log("length: ", length);
                  console.log("count: ", count);
                  res.send("Done");
                }
              })
              .catch(err => {
                console.error(
                  "Error updating new KRW-",
                  base,
                  " market data for Upbit"
                );
              });

            admin
              .firestore()
              .doc(
                `exchanges/upbit/KRW-${base}/${lastData.candle_date_time_utc}`
              )
              .set({
                startTime: lastStartTime,
                endTime: lastData.timestamp,
                price: lastData.trade_price,
                volume: lastData.candle_acc_trade_price
              })
              .then(() => {
                console.log(
                  "Last data updated for KRW-",
                  base,
                  " market of Upbit"
                );
                if (++count == length * 2) {
                  console.log("length: ", length);
                  console.log("count: ", count);
                  res.send("Done");
                }
              })
              .catch(err => {
                console.error(
                  "Error updating last KRW-",
                  base,
                  " market data for Upbit"
                );
              });
          });
        },
        50,
        null
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});
