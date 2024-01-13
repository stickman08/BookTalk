const jwt = require('../utils/jwt');
const { COOKIE_NAME, SECRET } = require("../config/constants");
const { getReviewById } = require('../services/bookService');

exports.auth = function (req, res, next) {
    const token = req.cookies[COOKIE_NAME];

    if (token) {
        jwt.verify(token, SECRET)
            .then(decodedToken => {
                req.user = decodedToken;
                res.locals.user = { ...decodedToken, _id: decodedToken._id };
                next();
            })
            .catch(err => {
                res.clearCookie(COOKIE_NAME);
                res.status(401).render('404');
            });
    } else {
        next();
    }
}

exports.isAuth = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.render('auth/login');
    }
}

exports.isGuest = function (req, res, next) {
    if (!req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

exports.isOwner = async function (req, res, next) {
    const book = await getReviewById(req.params.id);
    
    if (book.owner == req.user._id) {
        next();
    } else {
        res.redirect('/');
    }
}

exports.isNotOwner = async function (req, res, next) {
    const book = await getReviewById(req.params.id);
    
    if (book.owner != req.user._id) {
        next();
    } else {
        res.redirect('/');
    }
}
