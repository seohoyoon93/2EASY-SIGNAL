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

const url = "https://cobak.co.kr/community/1";

const runtimeOpts = {
  timeoutSeconds: 110,
  memory: "2GB"
};

//TODO: render react doms by using puppeteer to scrape cobak data

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
      await console.log("opening a new browser");
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 0
      });
      await console.log("opening a new page");
      const html = await page.content();
      await console.log("got content: ", html);
      let contentIds = [];

      await $("div.postingPreview___tLLsW a", html).each((i, elem) => {
        console.log("elem: ", elem);
        const contentId = $(elem)
          .attr("href")
          .match(/post\/([0-9]+)/)[0]
          .match(/[0-9]+/)[0];

        contentIds.push(contentId);
      });

      await contentIds.reduce(async (promise, contentId) => {
        const link = "https://cobak.co.kr/community/1/post/" + contentId;
        await promise;
        await page.goto(link, { waitUntil: "networkidle2", timeout: 0 });
        const subHtml = await page.content();
        const uploadTime = await $("div.date___YwB3m", subHtml).text();
        if (uploadTime.indexOf("분 전") !== -1) {
          const mins = parseInt(uploadTime.match(/\d/g).join(""));
          const timestamp = Date.now() - mins * 60000;
          const title = await $("div.title___1kaUK", subHtml).text();
          const content = await $("div.cobak-html p", subHtml).text();
          const comments = "";

          await admin
            .firestore()
            .doc(`communities/cobak/data/${contentId}`)
            .set({
              title,
              content,
              comments,
              timestamp
            })
            .then(() => {
              console.log("New data scraped for cobak");
            })
            .catch(err => {
              console.error("Failed to scrape cobak, ", err);
            });
        } else if (uploadTime.indexOf("방금") !== -1) {
          const timestamp = Date.now();
          const title = await $("div.title___1kaUK", subHtml).text();
          const content = await $("div.cobak-html p", subHtml).text();
          const comments = "";

          await admin
            .firestore()
            .doc(`communities/cobak/data/${contentId}`)
            .set({
              title,
              content,
              comments,
              timestamp
            })
            .then(() => {
              console.log("New data scraped for cobak");
            })
            .catch(err => {
              console.error("Failed to scrape cobak, ", err);
            });
        }
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
