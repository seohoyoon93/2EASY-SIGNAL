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

      await page.goto(
        "https://cafe.naver.com/ArticleList.nhn?search.clubid=22862592&search.menuid=316&search.boardtype=L",
        {
          waitUntil: "networkidle2",
          timeout: 0
        }
      );

      let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

      await sleep(1000);
      const frames = await page.frames();

      await sleep(1000);

      let mframe = [];
      for (const frame of frames) {
        if (
          frame
            .url()
            .includes(
              "ArticleList.nhn?search.clubid=22862592&search.menuid=316&search.boardtype=L"
            )
        ) {
          mframe = frame;
        }
      }
      const html = await mframe.content();

      // const db = admin.firestore();
      // let batch = db.batch();
      const db = admin.database();
      await $("div.article-board", html)
        .not("#upperArticleList")
        .find("tr")
        .each(async (i, elem) => {
          const title = $(elem)
            .find("div.board-list div.inner_list")
            .find("a.article")
            .text();

          if (title !== "") {
            const time = $(elem)
              .find("td.td_date")
              .text();

            const currentTime = new Date();
            const day = currentTime.getDate();
            const month = currentTime.getMonth();
            const year = currentTime.getFullYear();

            const uploadTime = `${year}-${month}-${day} ${time}`;
            const timestamp = await Date.parse(uploadTime + " UTC+9");

            const content = "";
            const comments = "";

            const contentId = $(elem)
              .find("div.board-number div.inner_number")
              .text();

            await db.ref(`communities/coinplanet/${contentId}`).set({
              title,
              content,
              comments,
              timestamp
            });
            // const ref = db.doc(`communities/coinplanet/data/${contentId}`);

            // batch.set(ref, {
            //   title,
            //   content,
            //   comments,
            //   timestamp
            // });
          }
        });
      // await batch.commit();
    } catch (e) {
      request.post(constants.SLACK_WEBHOOK_URL, {
        json: { text: `Coinplanet scraper error: ${e}` }
      });
      throw e;
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }

    await res.send("Done");
  });
