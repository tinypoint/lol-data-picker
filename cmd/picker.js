
const mongoose = require('mongoose');
const get = require('../utils/get');
const URLS = require('../lol/onlineUrls');
const { getHeroDetailUrls, getHeroDetailInfo } = require('../lol/getHeroDetailUrls');

const db = mongoose.connection;
const DB_URI = 'mongodb://127.0.0.1:27017/lol';

db.on('error', (err) => console.error('connection error:'));
db.once('open', () => {
    console.error('connection success')
});
mongoose.connect(DB_URI);

const heroInfoSchema = mongoose.Schema({
    championId: String,
    url: String,
    heroAvaUrl: String
});

const HeroInfo = mongoose.model('HeroInfos', heroInfoSchema);

async function getHeroInfo () {
    let heroListLength;
    await get(URLS.indexUrl).then(getHeroDetailUrls).then(detailObjs => {
        heroListLength = detailObjs.length;
        // 存储数据库操作
        detailObjs.forEach(detailObj => {
            get(detailObj.url).then(getHeroDetailInfo).then(heroInfo => {
                heroListLength --;
                HeroInfo.findOneAndUpdate({championId: detailObj.championId}, {$set: Object.assign({}, detailObj, heroInfo)}, {upsert: true, new: true}, (err, doc) => {
                    if (err) {
                        console.error(`插入英雄${detailObj.championId}时出现错误`)
                    } else {
                        console.log(`成功更新英雄${detailObj.championId}的信息`)
                    }
                    if (!heroListLength) {
                        db.close();
                    }
                    return;
                });
            });
        });
    });
}

getHeroInfo();



