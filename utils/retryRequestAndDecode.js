const iconv = require('iconv-lite');
const request = require('./request');

module.exports = (url, retryTimes = 1) => {
    return function retryRequestAndDecode () {
        return request(url).then(({err, res, body}) => {
            let html;
            try {
                html = iconv.decode(body, 'gb2312');
                return {
                    status: 1,
                    message: 'suc',
                    result: html
                };
            } catch (ex) {
                retryTimes--;
                if (!retryTimes) {
                    return {
                        status: 0,
                        message: '解析失败',
                        result: ''
                    };
                } else {
                    return retryRequestAndDecode();
                }
            }
        })
    }
}