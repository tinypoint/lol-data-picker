const mongoose = require('mongoose');

const MovieUrlSchema = mongoose.Schema({
    url: String,
    hasPicked: Boolean,
    title: String
});

const MovieUrl = mongoose.model('As-urls', MovieUrlSchema);

module.exports = MovieUrl;