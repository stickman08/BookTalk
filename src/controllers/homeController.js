const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home/home', {
        title: 'WordPress',
    });
});

module.exports = router;