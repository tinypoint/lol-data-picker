const mongoose = require('mongoose');

const MovieUrlSchema = mongoose.Schema({
    url: String,
    hasPicked: Boolean
});

const MovieUrl = mongoose.model('movie-urls', MovieUrlSchema);

module.exports = MovieUrl;