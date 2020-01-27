+'use strict';

/**
 * Pre-render generated pages.
 * You need to also
 * yarn add fs-path puppeteer serve --save
 * @todo: move this to vf-extensions
 * @todo: update hardcoded `build` path to use vfConfig.vfBuildDestination
 */

module.exports = function(gulp, path, buildDestionation) {

  const glob = require("glob")
  const puppeteer = require('puppeteer');
  const fsPath = require('fs-path');
  const handler = require('serve-handler');
  const http = require('http');

  async function crawler({ url }) {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

    let page = null;
    let html = false;

    // console.log(url)

    try {
      page = await browser.newPage();
      //networkidle0: consider navigation to be finished when
      //there are no more than 2 network connections for at least 500 ms.
      //(https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegobackoptions)
      await page.goto(url, { waitUntil: "networkidle0" });
      // await page.evaluate();
      html = await page.content();
    } catch (e) {
      debug.warn(`Not able to fetch ${url}`);
    } finally {
      // if (page) {
      //   await page.close();
      // }
      await browser.close();
      return html;
    }
  }

  const saveUrlToFile = function(html, pathName, output) {
    const savePath = output + '/build/' + pathName;

    fsPath.writeFile(savePath, html, function(err) {
      if (err) {
        throw err;
      } else {
        // console.log('Page pre-rendered and written.');
      }
    });
  };

  async function fetchAllPages() {
    const domain = "http://localhost:3010/";

    // for our approach, we only generate index.html files
    let pages = glob.sync("**/index.html", {cwd: 'build'})

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    
    for(let i = 0; i < pages.length; i++) {
      console.log(`Pre-rendering: ${pages[i]}, ${i+1} of ${pages.length}`);
      const html = await crawler({
        url: `${domain}${pages[i]}`,
        browser
      });
      saveUrlToFile(html, pages[i], __dirname);
    }
    await browser.close();
  }

  gulp.task('prerender', async() => {
    const server = http.createServer((request, response) => {
      // You pass two more arguments for config and middleware
      // More details here: https://github.com/zeit/serve-handler#options
      return handler(request, response, {
        "public": "build"
      });
    })

    server.listen(3010, () => {
      console.log('Listening at http://localhost:3010');
    });

    await fetchAllPages();
    server.close(function () { console.log('Server closed.'); })
    return "success";
  });
 
  return gulp;
};