const functions = require("firebase-functions");
const admin = require("firebase-admin");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const $ = require("cheerio");
const request = require("request");
const constants = require("../constants");
const config = functions.config().firebase;
try {
  admin.initializeApp(config);
} catch (e) {
  console.log(e);
}

const url = "https://gall.dcinside.com/board/lists?id=bitcoins";
const runtimeOpts = {
  timeoutSeconds: 200,
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
      let tempContentIds = [];
      await $("div.gall_listwrap tr.us-post td.gall_tit a", html).each(
        (i, elem) => {
          let contentId = $(elem)
            .attr("href")
            .match(/no=([0-9]+)/)[0]
            .match(/[0-9]+/)[0];
          tempContentIds.push(contentId);
        }
      );
      let contentIds = tempContentIds.sort((a, b) => b - a).slice(0, 14);

      const db = admin.firestore();
      let batch = db.batch();
      await contentIds.reduce(async (promise, contentId) => {
        const link =
          "https://gall.dcinside.com/board/view/?id=bitcoins&no=" + contentId;
        await promise;
        await page.goto(link, { waitUntil: "domcontentloaded", timeout: 0 });
        const subHtml = await page.content();
        const uploadTime = await $(
          "div.gallview_head span.gall_date",
          subHtml
        ).attr("title");
        const timestamp = await Date.parse(uploadTime + " UTC+9");
        const title = await $("span.title_subject", subHtml).text();
        let content = await $("div.writing_view_box div p", subHtml).text();
        const content2 = await $("div.writing_view_box div", subHtml).text();
        content = content + content2;
        const comments = await $("ul.cmt_list li.ub-content p", subHtml).text();

        const ref = db.doc(`communities/dcinside/data/${contentId}`);

        batch.set(ref, {
          title,
          content,
          comments,
          timestamp
        });
      }, Promise.resolve());
      await batch.commit();
    } catch (e) {
      request.post(constants.SLACK_WEBHOOK_URL, {
        json: { text: `Dcinside scraper error: ${e}` }
      });
      throw e;
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }

    return res.send("Done");
  });
