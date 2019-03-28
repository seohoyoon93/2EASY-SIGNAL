const chromium = require("chrome-aws-lambda");
const puppeteer = require('./node_modules/puppeteer');
const $ = require("cheerio");



(async () => {

    let browser = null;
    // launch browser with puppeteer and open a new page
    browser = await puppeteer.launch({
      headless: chromium.headless,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath
    });


    try {

      /* 로그인 제거
      const page = await browser.newPage();
      const naver_id = "easternegg";
      const naver_pw = "Easternegg1!";
      await page.goto('https://nid.naver.com/nidlogin.login');
      await page.evaluate((id, pw) => {
        document.querySelector('#id').value = id;
        document.querySelector('#pw').value = pw;
      }, naver_id, naver_pw);
      await page.click('.btn_global');
      await page.waitForNavigation();
      */
     
     const page = await browser.newPage();

     await page.goto('https://cafe.naver.com/ArticleList.nhn?search.clubid=24978815&search.menuid=332&search.boardtype=L', {
       waitUntil: "networkidle2",
       timeout: 0
     });
     
     var frames = await page.frames();

      let mframe = [];
     for (const frame of frames){
       if (frame.url().includes('ArticleList.nhn?search.clubid=24978815&search.menuid=332&search.boardtype=L')){
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
   
         let content = ""
         let comments = ""
         
         if (title !== ""){
         console.log("title :" + title)
         }

        });

        /*
        await admin
          .firestore()
          .doc(`communities/nvbitoka/data/${contentId}`)
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
          */
    } catch (e) {
      throw e;
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }


  })();
