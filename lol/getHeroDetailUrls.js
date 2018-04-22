const cheerio = require('cheerio');
const URL_REG= /javascript:window.location.href='(.*)'/;
const CHAMPIONID_REG = /championId=(\d+)/;

function getHeroDetailUrls (htmlString) {
    const $ = cheerio.load(htmlString);
    const ret = [];
    $('div.row').each((i, elem) => {
        const url = URL_REG.exec(elem.attribs.onclick)[1];
        const championId = CHAMPIONID_REG.exec(url)[1];
        ret.push({
            championId,
            url
        });
    });

    return ret;
}

function getHeroDetailInfo (htmlString) {
    const $ = cheerio.load(htmlString);

    return {
        heroAvaUrl: $('div.info1.fl img').map((i, elem) => {
            return elem.attribs.src;
        })[0]
    }
}

module.exports = {
    getHeroDetailUrls,
    getHeroDetailInfo
};