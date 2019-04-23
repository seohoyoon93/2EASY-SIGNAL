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

const url = "https://coinpan.com/free";
const cred = require("../config/coinpan_credentials");
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
      // const db = admin.firestore();
      // let batch = db.batch();
      const db = admin.database();
      await contentIds.reduce(async (promise, contentId) => {
        const link = "https://coinpan.com/free/" + contentId;
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
        const content = await $("div.read_body .xe_content", subHtml).text();
        const comments = await $("#comment .xe_content", subHtml).text();

        // const ref = db.doc(`communities/coinpan/data/${contentId}`);
        await db.ref(`communities/coinpan/${contentId}`).set({
          title,
          content,
          comments,
          timestamp
        });

        // batch.set(ref, {
        //   title,
        //   content,
        //   comments,
        //   timestamp
        // });
      }, Promise.resolve());
      // await batch.commit();
    } catch (e) {
      request.post(constants.SLACK_WEBHOOK_URL, {
        json: { text: `Coinpan scaper error: ${e}` }
      });
      throw e;
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }

    await res.send("Done");
  });
