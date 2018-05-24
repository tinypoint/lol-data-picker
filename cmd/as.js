const dbConnector = require('../database/connect');
const MovieUrl = require('../database/models/aUrl');
const Movie = require('../database/models/as');
const getDetail = require('../movie/getDetail');
const config = require('../config');
const DB_URI = `mongodb://${config.user}:${config.pwd}@127.0.0.1:27017/data-picker`;
const connection = dbConnector(DB_URI);

let page,
    pageSize = 20,
    errArr = [],
    promiseArr = [];

function getCurrent (arr, page, pageSize) {
    let length = arr.length;

    if ((page + 1) * pageSize > length) {
        return arr.slice(page * pageSize);
    } else {
        return arr.slice(page * pageSize, (page + 1) * pageSize);
    }
}

MovieUrl.find({}).then(docs => {
    docs = docs.filter(doc => !doc.hasPicked);
    let length = docs.length;
    let page = 0;

    function queue () {
        let bunch = [];
        let urlFlag = [];
        let pA = getCurrent(docs, page, pageSize).map(doc => {
            return getDetail(doc.url).then(res => {
                if (res.status) {
                    console.log(`${doc.url}页内的数据抓取完毕`);
                    bunch.push(res.result);
                    urlFlag.push(doc.url);
                } else {
                    console.error(`${doc.url}页${res.message}`);
                    errArr.push(doc.url);
                }
            });
        });

        return Promise.all(pA).then(() => {

            Promise.all(urlFlag.map(url => {
                return MovieUrl.findOneAndUpdate({url}, {hasPicked: true}).then(res => res).catch(err => {});
            })).then(() => {
                console.log(`更新第${page}批url标识`)
            })
            
            return Movie.insertMany(bunch).then(res => {
                console.log(`第${page}批存入数据库成功`);
                page++;
                if ((page + 1) * pageSize < length) {
                    return queue(page);
                } else {
                    connection.close();
                    console.log('\n');
                    console.log('\n');
                    console.log('结束');
                    console.log('\n');
                    console.log('\n');
                    console.log(`共${errArr.length}页抓取失败`);
                }
            })

            
        });
    }

    return queue();
})