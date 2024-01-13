const express = require('express');

const setupMongoose = require('./config/mongoose');
const { PORT } = require('./config/constants');
const routes = require('./routes');

const app = express();

// Setup express and view engine
require('./config/express')(app);
require('./config/hbs')(app);

// Add router
app.use(routes);

// Setup database and start server if successful
setupMongoose()
    .then(() => {
        app.listen(PORT, () => console.log(`The app is listening on port ${PORT}`));
    })
    .catch(err => {
        console.log('Database error', err);
    });
