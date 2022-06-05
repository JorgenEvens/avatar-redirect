const _get = require('lodash/get');
const fetch = require('lib/fetch');
const cheerio = require('cheerio');
const puppeteer = require('lib/puppeteer');

function stripSizeParameter(url) {
    if (typeof url !== 'string')
        return;

    // Strip size parameter
    // Ex: https://pbs.twimg.com/profile_images/1184774364702617600/2DmGoqCz_400x400.jpg
    return url.replace(/_([^.\/]+)\.([a-z]+)$/i, '.$2');
}

async function pullFromHTML(url, selector, attrs, fetchOptions = {}) {
    const res = await fetch(url, fetchOptions);
    const html = await res.text();
    const doc = cheerio.load(html);

    const profilePicture = doc(selector);
    const image = attrs.reduce((r, attr) => r || profilePicture.attr(attr), null);

    if (!image || typeof image != 'string')
        return null;

    return stripSizeParameter(image);
}

async function mobileProfileScrape(username) {
    username = encodeURIComponent(username);

    return pullFromHTML(
        `https://mobile.twitter.com/i/nojs_router?path=%2F${username}`,
        'td.avatar img',
        ['src'],
        {
            method: 'POST',
            headers: {
                'referer': `https://mobile.twitter.com/${username}`
            }
        }
    );

}

async function profileScrape(username) {
    username = encodeURIComponent(username);

    return pullFromHTML(
        `https://www.twitter.com/${username}/`,
        'a.profile-picture',
        ['data-resolved-url-large', 'data-url', 'href'],
    );
}

async function scrapeJavascriptPage(username) {
    const url = `https://twitter.com/${username}/photo`;

    function errorHandler(err) {
        if (err.name == 'TimeoutError')
            return null;

        throw err;
    }

    async function selector(page) {
        await page.waitForSelector('img[src*=profile_images]', {
            timeout: 2000
        });

        const img = await page.$('img[src*=profile_images]');
        const src = await img.getProperty('src');
        return await src.jsonValue();
    }

    async function interceptApi(page) {
        return new Promise(resolve => {
            page.on('response', async res => {
                if (!res.ok())
                    return;

                const resUrl = res.url().toLowerCase();
                if (!resUrl.includes(username.toLowerCase()))
                    return;

                const body = await res.json().catch(() => null);
                if (!body)
                    return;

                const picture = _get(body, 'data.user.result.legacy.profile_image_url_https');
                if (!picture)
                    return;

                resolve(picture);
            });
        });
    }

    return await puppeteer(url, async page => {
        const picture = await Promise.race([
            selector(page),
            interceptApi(page)
        ]);

        return stripSizeParameter(picture);
    }).catch(errorHandler);
}

module.exports = [
    scrapeJavascriptPage,
    mobileProfileScrape,
    profileScrape,
];
