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
const runtimeOpts = {
  timeoutSeconds: 280,
  memory: "2GB"
};

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    let browser = null;
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
      const html = await page.content();

      let contentIds = [];
      await $("#fboardlist tr", html)
        .not(".notice")
        .find("td.sbj a")
        .not(".dropdown-toggle")
        .each((i, elem) => {
          if (
            $(elem)
              .attr("href")
              .indexOf("wr_id=") !== -1
          ) {
            let contentId = $(elem)
              .attr("href")
              .match(/id=([0-9]+)/)[0]
              .match(/[0-9]+/)[0];
            contentIds.push(contentId);
          }
        });

      await contentIds.reduce(async (promise, contentId) => {
        const link =
          "http://cointalk.co.kr/bbs/board.php?bo_table=freeboard&wr_id=" +
          contentId;
        await promise;

        await page.goto(link, { waitUntil: "domcontentloaded", timeout: 0 });
        const subHtml = await page.content();

        const uploadTime = await $("#st-view div.info div.desc strong", subHtml)
          .eq(1)
          .text();
        const timestamp = await Date.parse(uploadTime + " UTC+9");
        const title = await $("div.info h4", subHtml).text();
        let content = await $("article.text p", subHtml).text();
        const content2 = await $("article.text h1", subHtml).text();
        content = content2 + content;

        const comments = await $("#st-comment p", subHtml).text();

        await admin
          .firestore()
          .doc(`communities/cointalk/data/${contentId}`)
          .set({
            title,
            content,
            comments,
            timestamp
          })
          .then(() => {})
          .catch(err => {
            console.error("Failed to scrape cointalk, ", err);
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
