const Book = require("../models/Book");

exports.getWishedForUser = (id) => Book.find({ wishingList: { $in: [id] } });
