const { isAuth, isOwner, isNotOwner } = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');
const { getAll, createReview, getReviewById, editReview, deleteReview, wishReview } = require('../services/bookService');
const { parseError } = require('../utils/parser');

const router = require('express').Router();

router.get('/catalog', async (req, res) => {
    const books = await getAll().lean();

    res.render('books/catalog', { 
        title: "Catalog Page",
        books 
    });
});

router.get('/create', isAuth, (req, res) => {
    res.render('books/create', {
        title: 'Create Page',
    });
});

router.post('/create',
    isAuth,
    body('title').trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 2 }).withMessage('Title should be at least 2 characters'),
    body('author').trim()
        .notEmpty().withMessage('Author is required')
        .isLength({ min: 5 }).withMessage('Author should be at least 5 characters'),
    body('genre').trim()
        .notEmpty().withMessage('Genre is required')
        .isLength({ min: 5 }).withMessage('Genre should be at least 5 characters'),
    body('stars').trim()
        .notEmpty().withMessage('Stars are required')
        .isNumeric({ min: 1, max: 5 }).withMessage('Stars must be a number between 1 and 5'),
    body('image').trim()
        .notEmpty().withMessage('Image is required')
        .matches(/^https?:\/\/.*$/).withMessage('Invalid image url'),
    body('review')
        .notEmpty().withMessage('Review is required')
        .isLength({ min: 10 }).withMessage('Review should be at least 10 characters'),
    async (req, res) => {
        try {
            const { errors } = validationResult(req);
            if (errors.length > 0) throw errors;

            // Create book review
            await createReview(req.body, req.user._id);

            res.redirect('/books/catalog');
        } catch (err) {
            res.render('books/create', {
                errors: parseError(err).messages,
                body: req.body,
            });
        }
    });

router.get('/catalog/:id', async (req, res) => {
    const book = await getReviewById(req.params.id).lean();
    res.render('books/details', { 
        title: 'Details Page',
        isOwner: req.user?._id == book.owner._id,
        isWished: book.wishingList.find(e => e == req.user?._id),
        ...book 
    });
});

router.get('/catalog/:id/edit',
    isAuth,
    isOwner,
    async (req, res) => {
        const book = await getReviewById(req.params.id).lean();
        res.render('books/edit', {
            title: 'Edit Page',
            ...book,
        });
    });

router.post('/catalog/:id/edit',
    isAuth,
    isOwner,
    body('title').trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 2 }).withMessage('Title should be at least 2 characters'),
    body('author').trim()
        .notEmpty().withMessage('Author is required')
        .isLength({ min: 5 }).withMessage('Author should be at least 5 characters'),
    body('genre').trim()
        .notEmpty().withMessage('Genre is required')
        .isLength({ min: 5 }).withMessage('Genre should be at least 5 characters'),
    body('stars').trim()
        .notEmpty().withMessage('Stars are required')
        .isNumeric({ min: 1, max: 5 }).withMessage('Stars must be a number between 1 and 5'),
    body('image').trim()
        .notEmpty().withMessage('Image is required')
        .matches(/^https?:\/\/.*$/).withMessage('Invalid image url'),
    body('review')
        .notEmpty().withMessage('Review is required')
        .isLength({ min: 10 }).withMessage('Review should be at least 10 characters'),
    async (req, res) => {
        try {
            const { errors } = validationResult(req);
            if (errors.length > 0) throw errors;

            // Edit book review
            const edited = await editReview(req.params.id, req.body);

            res.redirect(`/books/catalog/${edited._id}`);
        } catch (err) {
            res.render('books/create', {
                errors: parseError(err).messages,
                body: req.body,
            });
        }
    });

router.get('/catalog/:id/delete', 
    isAuth,
    isOwner, 
    async (req, res) => {
        await deleteReview(req.params.id);
        res.redirect('/books/catalog');
    });

router.get('/catalog/:id/wish',
    isAuth,
    isNotOwner,
    async (req, res) => {
        try {
            const bookReview = await wishReview(req.params.id, req.user._id);
            console.log(req.user._id);

            res.redirect(`/books/catalog/${bookReview._id}`)
        } catch (err) {
            res.redirect(`/books/catalog/${id}`);
        }
    });

module.exports = router;
