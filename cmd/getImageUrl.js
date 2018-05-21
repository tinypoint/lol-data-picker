const dbConnector = require('../database/connect');
const PictureUrl = require('../database/models/pictureUrl');
const getUrls = require('../common/getUrls');
const config = require('../config');
const DB_URI = `mongodb://${config.user}:${config.pwd}@127.0.0.1:27017/data-picker`;
const connection = dbConnector(DB_URI);

let startIndex = 0;
let endIndex = 200;
let errArr = [];
let wangpanModuleId = 22;
let moduleMap = {
    16: 'Asia',
    22: 'katong'
}
function gePromiseArr (startIndex, endIndex) {
    let arr = [];
    for (let i = startIndex; i <= endIndex; i++) {
        arr.push(getUrls(i, wangpanModuleId).then(res => {
            if (res && res.status) {
                console.log(`第${i}页的urls抓取完毕`);
                return PictureUrl.insertMany(res.result.map(({url, title}) => ({url, hasPicked: false, title: title, type: moduleMap[wangpanModuleId]}))).then(res => res);
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