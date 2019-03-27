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

const url = "https://www.moneynet.co.kr/free_board";
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
      await $("#board_list", html)
        .find("tr")
        .not(".notice")
        .find("td.title")
        .find("a")
        .not("[title=Replies]")
        .each((i, elem) => {
          let contentId = $(elem)
            .attr("href")
            .match(/free_board\/([0-9]+)/)[0]
            .match(/[0-9]+/)[0];
          contentIds.push(contentId);
        });




      await contentIds.reduce(async (promise, contentId) => {
        const link = "https://www.moneynet.co.kr/free_board/" + contentId;
        await promise;

        await page.goto(link, { waitUntil: "domcontentloaded", timeout: 0 });
        const subHtml = await page.content();
        const title = await $("div.read_header h1", subHtml).text();

        const content = await $("div.read_body .xe_content p span", subHtml).text();
        const content2 = await $("div.read_body .xe_content", subHtml).text();
        const content3 = await $("div.read_body .xe_content p", subHtml).text();

        content = content+content2+content3

        const comments = await $("#comment .xe_content", subHtml).text();

        await admin
          .firestore()
          .doc(`communities/moneynet/data/${contentId}`)
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
