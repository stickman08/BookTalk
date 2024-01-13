const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { auth } = require('../middlewares/authMiddleware');

function setupExpress(app) {
    app.locals.title = 'Book Talk'
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(auth);
}

module.exports = setupExpress;