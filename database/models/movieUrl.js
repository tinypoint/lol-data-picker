const mongoose = require('mongoose');

const MovieUrlSchema = mongoose.Schema({
    url: String,
    hasPicked: Boolean
});

const MovieUrl = mongoose.model('movie-uras', MovieUrlSchema);

module.exports = MovieUrl;