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

const url = "http://cointalk.co.kr/bbs/board.php?bo_table=freeboard";
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
      let contentIds = [];
      await $("#fboardlist", html)
        .find("tr")
        .not(".notice")
        .find("td.sbj")
        .find("a")
        .each((i, elem) => {
          let contentId = $(elem)
            .attr("href")
            .match(/id=([0-9]+)/)[0]
            .match(/[0-9]+/)[0];
          contentIds.push(contentId);
        });


      await contentIds.reduce(async (promise, contentId) => {
        const link = "http://cointalk.co.kr/bbs/board.php?bo_table=freeboard&wr_id=" + contentId;
        await promise;

        await page.goto(link, { waitUntil: "domcontentloaded", timeout: 0 });
        const subHtml = await page.content();


        const title = await $("div.info h4", subHtml).text();
        const content = await $("article.text p", subHtml).text();
        const content2 = await $("article.text h1", subHtml).text();
        content = content2+content

        const comments = await $("#st-comment p", subHtml).text();


        await admin
          .firestore()
          .doc(`communities/cointalk/data/${contentId}`)
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
