const mongoose = require('mongoose');

const connection = mongoose.connection;

connection.on('error', (err) => console.error('connection error:'));
connection.once('open', () => console.log('connection success'));

module.exports = dbUrl => {
    mongoose.connect(dbUrl);
    return connection;
}