require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    DB_URI: process.env.DB_URI || 'mongodb://127.0.0.1:27017/book-talk',
    COOKIE_NAME: process.env.COOKIE_NAME || 'auth',
    SECRET: process.env.SECRET || 'victoriasecret',
    SALT_ROUNDS: process.env.SALT_ROUNDS || 10,
};
