const { promisify } = require('util')
const jwt = require('jsonwebtoken');

exports.sign = promisify(jwt.sign);
exports.verify = promisify(jwt.verify);