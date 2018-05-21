const dbConnector = require('../database/connect');
const PictureUrl = require('../database/models/pictureUrl');
const Picture = require('../database/models/picture');
const getDetail = require('../movie/getDetail');
const config = require('../config');
const DB_URI = `mongodb://${config.user}:${config.pwd}@127.0.0.1:27017/data-picker`;
const connection = dbConnector(DB_URI);
const fs = require('fs-extra');
const originRequest = require("request");
const mkdirp = require('mkdirp');
	 
//本地存储目录
const dir = './images';
	 
//创建目录
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});
	  
//下载方法
const download = function(url, dir, filename){
    originRequest.head(url, function(err, res, body){
        originRequest(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};

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

PictureUrl.find({}).then(docs => {
    docs = docs.filter(doc => !doc.hasPicked);
    let length = docs.length;
    let page = 0;

    function queue () {
        let bunch = [];
        let urlFlag = [];
        
        let pA = getCurrent(docs, page, pageSize).map(doc => {
            return getDetail(doc.url).then(res => {
                if (res.status) {
                    let images = res.result.images;
                    images.forEach(src => {
                        console.log(src)
                        download(src, dir, Math.floor(Math.random()*100000) + src.substr(-4,4));
                    })
                    
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
        });
    }

    return queue();
})