const { isAuth } = require('../middlewares/authMiddleware');
const { getWishedForUser } = require('../services/userService');

const router = require('express').Router();

router.get('/profile', 
    isAuth,
    async (req, res) => {
    const wishedBooks = await getWishedForUser(req.user._id).lean();
    res.render('user/profile', {
        title: 'Profile Page',
        wishedBooks,
    });
});

module.exports = router;
