const { engine } = require('express-handlebars');
const path = require('path');

function setupHbs(app) {
    // Setup view engine 
    // ***handlebars***
    app.set('view engine', 'hbs');
    app.set('views', path.resolve(__dirname, '../views'));
    app.engine('hbs', engine({
        extname: 'hbs',
    }));

    /* Does not work
    // Register helper functions
    // Checks if an array contains the value
    Handlebars.registerHelper('ifContains', function (array, value, options) {
        array.indexOf(value) > -1 ? options.fn(this) : options.inverse(this);
    });

    // Checks for equality
    Handlebars.registerHelper('eq', function(value1, value2, options) {
        value1 === value2 ? options.fn(this) : options.inverse(this);
    });
    */
}

module.exports = setupHbs;
