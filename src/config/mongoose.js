const mongoose = require('mongoose');
const { DB_URI } = require('./constants');

function setupMongoose() {
    return mongoose.connect(DB_URI);
}

module.exports = setupMongoose;