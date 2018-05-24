const dbConnector = require('../database/connect');
const MovieUrl = require('../database/models/asUrl');
const getUrls = require('../common/getUrls');
const config = require('../config');
const DB_URI = `mongodb://${config.user}:${config.pwd}@127.0.0.1:27017/data-picker`;
const connection = dbConnector(DB_URI);

let startIndex = 201;
let endIndex = 2949;
let errArr = [];
let wangpanModuleId = 48;
console.log('开始抓取数据');
function gePromiseArr (startIndex, endIndex) {
    let arr = [];
    for (let i = startIndex; i <= endIndex; i++) {
        arr.push(getUrls(i, wangpanModuleId).then(res => {
            if (res && res.status) {
                console.log(`第${i}页的urls抓取完毕`);
                return MovieUrl.insertMany(res.result.map(({url, title}) => ({title, url, hasPicked: false}))).then(res => res);
            } else {
                errArr.push(i)
                console.log(`第${i}页${res.message}`);
            }
        }));
    }
    return arr;
}

Promise.all(gePromiseArr(startIndex, endIndex)).then(() => {
    connection.close();
    console.log('\n');
    console.log('\n');
    console.log('结束');
    if (errArr.length > 0) {
        console.log('\n');
        console.log('\n');
        console.log('以下页面的url获取失败');
        console.log(errArr.join(','));
        if (false) {
            // redo
        }
    } else {
        console.log('\n');
        console.log('\n');
        console.log('全部页面抓取成功');
    }
});