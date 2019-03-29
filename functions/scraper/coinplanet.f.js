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

      await page.goto(
        "https://cafe.naver.com/ArticleList.nhn?search.clubid=22862592&search.menuid=316&search.boardtype=L",
        {
          waitUntil: "networkidle2",
          timeout: 0
        }
      );

      var frames = await page.frames();

      let mframe = [];
      frames.reduce(async (promise, frame) => {
        await promise;
        if (
          await frame
            .url()
            .includes(
              "ArticleList.nhn?search.clubid=24978815&search.menuid=332&search.boardtype=L"
            )
        ) {
          mframe = await frame;
        }
      }, Promise.resolve());

      const html = await mframe.content();

      const article = await $("div.article-board", html)
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

            await admin
              .firestore()
              .doc(`communities/coinplanet/data/${contentId}`)
              .set({
                title,
                content,
                comments,
                timestamp
              });
          }
        });
    } catch (e) {
      throw e;
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }

    return res.send("Done");
  });
