const functions = require("firebase-functions");
const admin = require("firebase-admin");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const $ = require("cheerio");
const config = functions.config().firebase;
try {
  admin.initializeApp(config);
} catch (e) {
  console.log(e);
}

const url = "https://cobak.co.kr/community/all";
//const cred = require("../config/coinpan_credentials");
const runtimeOpts = {
  timeoutSeconds: 110,
  memory: "2GB"
};

exports = module.exports = functions
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
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 0
      });

      /*
      await page.type(".idpw_id", cred.COINPAN_ID);
      await page.type(".idpw_pass", cred.COINPAN_PW);
      await Promise.all([
        page.click(".loginbutton input"),
        page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 0 })
      ]);
      */
      const html = await page.content();
      // await console.log($(".userName p span", html).text());
      // Note: Above code checks if login succeeded

      let ids = [];

      await $("div.postingPreview___tLLsW", html)
        .find("a")
        .each((i, elem) => {
          let community = $(elem)
            .attr("href")
            .match(/community\/([0-9]+)/)[0]
            .match(/[0-9]+/)[0];

          let content = $(elem)
            .attr("href")
            .match(/post\/([0-9]+)/)[0]
            .match(/[0-9]+/)[0];

          let id = { content, community }
          ids.push(id);
        });




      await ids.reduce(async (promise, id) => {
        const link = "https://cobak.co.kr/community/" + id.community + "/post/" + id.content;
        await promise;
        await page.goto(link, { waitUntil: "domcontentloaded", timeout: 0 });
        const subHtml = await page.content();



        const title = await $("div.title___1kaUK", subHtml).text();
        const content = await $("div.cobak-html p", subHtml).text();
        const comments = ""


        await admin
          .firestore()
          .doc(`communities/cobak/data/${id.community}/${id.content}`)
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
