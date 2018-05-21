const mongoose = require('mongoose');

const PictureSchema = mongoose.Schema({
    title: String,
    images: Array,
    originPageUrl: String,
});

const Picture = mongoose.model('pictures', PictureSchema);

module.exports = Picture;