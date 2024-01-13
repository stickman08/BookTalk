const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config/constants');

const userSchema = Schema({
    username: {
        type: String,
        require: [true, 'Username is required'],
        minLength: [4, 'Username is too short'],
        maxLength: [12, 'Username is too long'],
    },
    email: {
        type: String,
        require: [true, 'Email is required'],
        minLength: [10, 'Email is too short'],
    },
    password: {
        type: String,
        require: [true, 'Password is required'],
        minLength: [3, 'Password is too short'],
        maxLength: [12, 'Password is too long'],
    },
});

userSchema.pre('save', function (next) {
    return bcrypt.hash(this.password, SALT_ROUNDS)
        .then((hash) => {
            this.password = hash;
            return next();
        });
});

userSchema.method('validatePassword', function (password) {
    return bcrypt.compare(password, this.password);
});

const User = model('User', userSchema);

module.exports = User;
