const mongoose = require('mongoose');

const PictureUrlSchema = mongoose.Schema({
    url: String,
    hasPicked: Boolean,
    title: String,
    type: String
});

const PictureUrl = mongoose.model('picture-urls', PictureUrlSchema);

module.exports = PictureUrl;