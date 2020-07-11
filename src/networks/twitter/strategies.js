const fetch = require('lib/fetch');
const cheerio = require('cheerio');

async function pullFromHTML(url, selector, attrs, fetchOptions = {}) {
    const res = await fetch(url, fetchOptions);
    const html = await res.text();
    const doc = cheerio.load(html);

    const profilePicture = doc(selector);
    const image = attrs.reduce((r, attr) => r || profilePicture.attr(attr), null);

    if (!image || typeof image != 'string')
        return null;

    // Strip size parameter
    // Ex: https://pbs.twimg.com/profile_images/1184774364702617600/2DmGoqCz_400x400.jpg
    const original = image.replace(/_([^.\/]+)\.([a-z]+)$/i, '.$2');

    return original;
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

module.exports = [
    mobileProfileScrape,
    profileScrape,
];
