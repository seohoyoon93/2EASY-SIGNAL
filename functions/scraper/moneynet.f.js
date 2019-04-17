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

const url = "https://www.moneynet.co.kr/free_board";
const runtimeOpts = {
  timeoutSeconds: 110,
  memory: "1GB"
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
      await $("#board_list tr", html)
        .not(".notice")
        .find("td.title")
        .find("a")
        .not("[title=Replies]")
        .each((i, elem) => {
          let contentId = $(elem)
            .attr("href")
            .match(/document_srl=([0-9]+)|free_board\/([0-9]+)/)[0]
            .match(/[0-9]+/)[0];
          contentIds.push(contentId);
        });

      const db = admin.firestore();
      let batch = db.batch();

      await contentIds.reduce(async (promise, contentId) => {
        const link = "https://www.moneynet.co.kr/free_board/" + contentId;
        await promise;

        await page.goto(link, { waitUntil: "domcontentloaded", timeout: 0 });
        const subHtml = await page.content();
        const uploadTime = await $("div.board_read ul.wt_box", subHtml)
          .eq(0)
          .children()
          .last()
          .find("span.number")
          .text();
        const timestamp = await Date.parse(uploadTime + " UTC+9");
        const title = await $("div.read_header h1", subHtml).text();

        let content = await $(
          "div.read_body .xe_content p span",
          subHtml
        ).text();
        const content2 = await $("div.read_body .xe_content", subHtml).text();
        const content3 = await $("div.read_body .xe_content p", subHtml).text();

        content = content + content2 + content3;

        const comments = await $("#comment .xe_content", subHtml).text();

        const ref = db.doc(`communities/moneynet/data/${contentId}`);

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
        json: { text: `Moneynet scraper error: ${e}` }
      });
      throw e;
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }

    return res.send("Done");
  });
