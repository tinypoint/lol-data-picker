const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
    title: String,
    images: Array,
    originPageUrl: String,
    movieName: String,
    size: String,
    filetype: String,
    duration: String,
    isMosaic: String,
    urls: Array
});

const Movie = mongoose.model('Movies', MovieSchema);

module.exports = Movie;