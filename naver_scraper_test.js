const chromium = require("chrome-aws-lambda");
const puppeteer = require('./node_modules/puppeteer');
const $ = require("cheerio");

const url = "https://coinpan.com/free";


(async () => {
/*
    let browser = null;
    // launch browser with puppeteer and open a new page
    browser = await puppeteer.launch({
      headless: chromium.headless,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath
    });
*/
    const browser = await puppeteer.launch();

    try {

      /*
      const page = await browser.newPage();
      await page.goto("https://nid.naver.com/nidlogin.login", {
        waitUntil: "domcontentloaded",
        timeout: 0
      });
      await page.type("#id", "easternegg");
      await page.type("#pw", "Easternegg1!");
      await Promise.all([
        page.click("input.btn_global"),
        page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 0 })
      ]);

    //  await page.waitForNavigation();
    //  const html = await page.content();

    //  await page.waitForNavigation();
  //    await page.goto('https://naver.com');
      await page.screenshot({ path: './naver.png', fullPage:true });
      console.log("done")
*/
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
    //  await page.goto('https://naver.com');
    //  await page.screenshot({ path: './naver.png', fullPage:true });
      console.log("login done")


     await page.goto('https://cafe.naver.com/ArticleList.nhn?search.clubid=25698071&search.menuid=127&search.boardtype=L', {
       waitUntil: "domcontentloaded",
       timeout: 0
     });

     var frames = await page.frames();

      let mframe = [];
     for (const frame of frames){
       if (frame.url().includes('ArticleList.nhn?search.clubid=25698071&search.menuid=127&search.boardtype=L')){
         console.log(frame.url())
               mframe = frame
        }
     }

      const html = await mframe.content();
      console.log("done2")

      let contentIds = [];
      await $("div.article-board", html)
        .not("#upperArticleList")
        .find("tr")
        .find("div.inner_list")
        .find("a.article")
        .each((i, elem) => {
          let contentId = $(elem)
            .attr("href")
            .match(/articleid=([0-9]+)/)[0]
            .match(/[0-9]+/)[0];
          contentIds.push(contentId);
        });


      await contentIds.reduce(async (promise, contentId) => {
        const link = "https://cafe.naver.com/ArticleRead.nhn?clubid=25698071&page=1&menuid=127&boardtype=L&articleid=" + contentId + "&referrerAllArticles=false";
        await promise;
        await page.goto(link, { waitUntil: "domcontentloaded", timeout: 0 });

        var postingframes = await page.frames();

         let pframe = [];
        for (const frame of postingframes){
          if (frame.url().includes('&boardtype=L&articleid=')){
            console.log(frame.url())
                  pframe = frame
           }
        }

        const subHtml = await pframe.content();
        const title = await $("div.tit-box td span.b.m-tcol-c", subHtml).text();
        const content = await $("#tbody p", subHtml).text();
        const comments = ""

        await console.log("title :" + title)
        await console.log("content :" + content)

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

      }, Promise.resolve());

    } catch (e) {
      throw e;
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }


  })();
