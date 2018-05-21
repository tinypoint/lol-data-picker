const cheerio = require('cheerio');
const request = require('../utils/request');
const formatData = require('./formatData');
const retryRequestAndDecodeGe = require('../utils/retryRequestAndDecode');

module.exports = detailPageUrl => {
    let retryTimes = 5;

    const retryRequestAndDecode = retryRequestAndDecodeGe(detailPageUrl, retryTimes);

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

            let node = $('#ks_xp');
            let title = node.find('.title').html();
            let infos = [];
            let images = [];
            node.find('.n_bd').contents().each((i, item) => {
                let child = $(item);
                // 文字信息
                if (child[0].type === 'text') {
                    if ($(item).text().trim()) {
                        infos.push($(item).text().trim());
                    }
                }
                // 图片
                if (child[0].type === 'tag' && child[0].name === 'img') {
                    images.push($(item).attr('src'));
                }
            });
            return {
                status: 1,
                message: 'suc',
                result: formatData({
                    title,
                    infos,
                    images,
                    detailPageUrl
                })
            };
        }
    });
}