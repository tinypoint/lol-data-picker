const cheerio = require('cheerio');
const request = require('../utils/request');
const retryRequestAndDecodeGe = require('../utils/retryRequestAndDecode');
const config = require('../config');

const getUrl = (pageIndex, moduleId) => `${config.host}/html/part/${moduleId}${pageIndex ? `_${pageIndex}` : ''}.html`
let adLength = 6;

module.exports = (pageIndex, moduleId) => {
    let url = getUrl(pageIndex, moduleId);
    let retryTimes = 5;

    const retryRequestAndDecode = retryRequestAndDecodeGe(url, retryTimes);

    return retryRequestAndDecode().then(res => {
        if (!res.status) {
            return {
                status: 0,
                message: '解析失败',
                result: ''
            };
        } else {
            let html = res.result;
            let $ = cheerio.load(html, { decodeEntities: false });
            const result = [];
            $('#ks_xp .list table.listt').slice(adLength).each((i, elem) => {
                $(elem).find('a').each((ii, a) => {
                    if (ii === 1) {
                        let node = $(a);
                        let title = node.text();
                        let detailPageLink = `${config.host}${node.attr('href')}`;
                        result.push({
                            title,
                            url: detailPageLink
                        });
                    }
                });
            });
            
            return {
                status: 1,
                message: 'suc',
                result 
            };
        }
    });
}