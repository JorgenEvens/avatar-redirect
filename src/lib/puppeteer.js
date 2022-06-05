const puppeteer = require('puppeteer-core');
const { PUPPETEER_REVISIONS } = require('puppeteer-core/lib/cjs/puppeteer/revisions');

const browser = (async function() {
    const browserFetcher = puppeteer.createBrowserFetcher();
    await browserFetcher.download(PUPPETEER_REVISIONS.chromium);

    return await puppeteer.launch();
})();

// Prevent crash
browser.catch(() => {});

module.exports = async function fetch(url, handler) {
    const page = await (await browser).newPage();

    try {
        await page.goto(url);
        const result = await handler(page);
        await page.close();
        return result;
    } catch(e) {
        await page.close();
        throw e;
    }
};
