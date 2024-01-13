const router = require('express').Router();
const { isGuest, isAuth } = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');
const { register, login } = require('../services/authService');
const { COOKIE_NAME } = require('../config/constants');
const { parseError } = require('../utils/parser');

// Handle login
router.get('/login', isGuest, (req, res) => {
    res.render('auth/login', { title: 'Login Page' });
});
router.post('/login',
    isGuest,
    body('email').trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be valid')
        .normalizeEmail(),
    body('password').trim()
        .notEmpty().withMessage('Password is required'),
        // .isLength({ min: 6, max: 12 }).withMessage('Password must be between 6 and 12 characters'),
    async (req, res) => {
        try {
            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }

            const userToken = await login({
                email: req.body.email,
                password: req.body.password,
            });

            res.cookie(COOKIE_NAME, userToken, { httpOnly: true });
            res.redirect('/');
        } catch (err) {
            res.render('auth/login', {
                title: 'Login Page',
                errors: parseError(err).messages,
                body: req.body,
            });
        }
    });

// Handle register
router.get('/register', isGuest, (req, res) => {
    res.render('auth/register', { title: 'Register Page' });
});
router.post('/register',
    isGuest,
    body('email').trim()
        .notEmpty().withMessage('Email is required')
        .isLength({ min: 10 }).withMessage('Email should be at least 10 characters long')
        .isEmail().withMessage('Email must be valid')
        .normalizeEmail(),
    body('username').trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 4, max: 12 }).withMessage('Username should be between 4 and 12 characters'),
    body('password').trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 3, max: 12 }).withMessage('Password must be between 3 and 12 characters'),
    body('confPassword').trim()
        .custom((value, { req }) => value === req.body.password).withMessage('Passwords don\'t match'),
    async (req, res) => {
        try {
            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }

            const userToken = await register({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            });

            res.cookie(COOKIE_NAME, userToken);
            res.redirect('/');
        } catch (err) {
            res.render('auth/register', {
                title: 'Register Page',
                errors: parseError(err).messages,
                body: req.body,
            });
        }
    });

// Handle logout
router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/');
});

module.exports = router;
