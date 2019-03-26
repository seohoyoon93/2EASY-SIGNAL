const functions = require("firebase-functions");
const admin = require("firebase-admin");
const request = require("request");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const $ = require("cheerio");

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

const coinpanUrl = "https://coinpan.com/free";
const cred = require("./config/coinpan_credentials");
const runtimeOpts = {
  timeoutSeconds: 110,
  memory: "2GB"
};

exports.coinpanScraper = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    let browser = null;
    // launch browser with puppeteer and open a new page
    browser = await puppeteer.launch({
      headless: chromium.headless,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath
    });
    try {
      const page = await browser.newPage();
      await page.goto(coinpanUrl, {
        waitUntil: "domcontentloaded",
        timeout: 0
      });
      await page.type(".idpw_id", cred.COINPAN_ID);
      await page.type(".idpw_pass", cred.COINPAN_PW);
      await Promise.all([
        page.click(".loginbutton input"),
        page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 0 })
      ]);
      const html = await page.content();
      // await console.log($(".userName p span", html).text());
      // Note: Above code checks if login succeeded
      let contentIds = [];
      await $("#board_list tr", html)
        .not(".notice")
        .find("td.title")
        .find("a")
        .not("[title=Replies]")
        .each((i, elem) => {
          let contentId = $(elem)
            .attr("href")
            .match(/document_srl=([0-9]+)|free\/([0-9]+)/)[0]
            .match(/[0-9]+/)[0];
          contentIds.push(contentId);
        });
      await contentIds.reduce(async (promise, contentId) => {
        const link = "https://coinpan.com/free/" + contentId;
        await promise;
        await page.goto(link, { waitUntil: "domcontentloaded", timeout: 0 });
        const subHtml = await page.content();
        const title = await $("div.read_header h1", subHtml).text();
        const content = await $("div.read_body .xe_content", subHtml).text();
        const comments = await $("#comment .xe_content", subHtml).text();
        await admin
          .firestore()
          .doc(`communities/coinpan/data/${contentId}`)
          .set({
            title,
            content,
            comments
          })
          .then(() => {
            console.log("New data scraped for coinpan");
          })
          .catch(err => {
            console.error("Failed to scrape coinpan, ", err);
          });
      }, Promise.resolve());
    } catch (e) {
      throw e;
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }

    return res.send("Done");
  });
