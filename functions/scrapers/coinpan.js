const cred = require("../config/coinpan_credentials");
const puppeteer = require("puppeteer");
const $ = require("cheerio");
const url = "https://coinpan.com/free";

(async () => {
  // launch browser with puppeteer and open a new page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.type(".idpw_id", cred.COINPAN_ID);
  await page.type(".idpw_pass", cred.COINPAN_PW);
  await Promise.all([
    page.click(".loginbutton input"),
    page.waitForNavigation({ waitUntil: "networkidle0" })
  ]);
  const html = await page.content();
  // await console.log($(".userName p span", html).text());
  // Note: Above code checks if login succeeded
  let links = [];
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
      let link = "https://coinpan.com/free/" + contentId;
      links.push(link);
    });
  await links.reduce(async (promise, link) => {
    await promise;
    await page.goto(link, { waitUntil: "networkidle2" });
    const subHtml = await page.content();
    const title = await $("div.read_header h1", subHtml).text();
    const content = await $("div.read_body .xe_content", subHtml).text();
    const comments = await $("#comment .xe_content", subHtml).text();
    await console.log("title: ", title);
    await console.log("content: ", content);
    await console.log("comments: ", comments);
  }, Promise.resolve());

  await browser.close();
})();
