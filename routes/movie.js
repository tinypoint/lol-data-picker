const express = require('express');
const router = express.Router();
const Movie = require('../database/models/movie');

router.post('/search', function(req, res, next) {
    let searchKey = req.body.searchKey,
        hasM = req.body.hasM;
        
    Movie.find({
        movieName: {
            $regex: new RegExp(`^.*${searchKey}.*$`) 
        },
        isMosaic: {
            $regex: new RegExp(`^.*${hasM ? '有' : '无'}.*$`)
        }
    }).then(docs => {
        res.json({
            status: 1,
            message: 'suc',
            result: docs
        });
    }).catch(err => {
        res.json({
            status: 0,
            message: 'failed',
            result: []
        });
    })
});

module.exports = router;
