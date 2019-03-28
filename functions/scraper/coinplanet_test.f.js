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
  timeoutSeconds: 280,
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

     await page.goto('https://cafe.naver.com/ArticleList.nhn?search.clubid=22862592&search.menuid=316&search.boardtype=L', {
       waitUntil: "networkidle2",
       timeout: 0
     });

     var frames = await page.frames();

      let mframe = [];
     for (const frame of frames){
       if (frame.url().includes('ArticleList.nhn?search.clubid=22862592&search.menuid=316&search.boardtype=L')){
         console.log(frame.url())
               mframe = frame
        }
     }

      const html = await mframe.content();


      const article = await $("div.article-board", html)
        .not("#upperArticleList")
        .find("tr").each((i, elem) => {
          let title = $(elem)
          .find("div.board-list div.inner_list")
          .find("a.article")
          .text();
   
         if (title !== ""){
          console.log("title :" + title)

          const time = $(elem)
           .find("td.td_date")
           .match(/[0-9]+/)[0];
 
           var currentTime = Date.now()
           var day = currentTime.getDate()
           var year = currentTime.getFullYear()
 
           const uploadTime = `${year}`+`${day}`+`${time}`
           const timestamp = await Date.parse(uploadTime + " UTC+9");
    
           let content = ""
           let comments = ""
 
          await admin
          .firestore()
          .doc(`communities/nvbitoka/data/${contentId}`)
          .set({
            title,
            content,
            comments,
            timestamp
          })
         }

        });

    
    } catch (e) {
      throw e;
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }


  });
