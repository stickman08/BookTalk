const { Schema, model, Types: { ObjectId } } = require('mongoose');

const bookSchema = Schema({
    title: {
        type: String,
        require: [true, 'Title is required'],
        // minLength: [3, 'Title is too short'],
        // maxLength: [12, 'Title is too long'],
    },
    author: {
        type: String,
        require: [true, 'Author is required'],
    },
    image: {
        type: String,
        require: [true, 'Image is required'],
        validate: {
            validator: function(imageUrl) {
                var imageRegex = /^https?:\/\/.*$/;
                return (!imageUrl || !imageUrl.trim().length) || imageRegex.test(imageUrl);
            },
            message: 'Provided image url is invalid',
        },
    },
    review: {
        type: String,
        require: [true, 'Review is required'],
    },
    genre: {
        type: String,
        require: [true, 'Genre is required'],
    },
    stars: {
        type: Number,
        require: [true, 'Stars are required'],
        min: [1, 'Stars should be at least 1'],
        max: [5, 'Stars should not exceed 5'],
    },
    wishingList: [{
        type: ObjectId,
        ref: 'User',
    }],
    owner: {
        type: ObjectId,
        ref: 'User',
    },
});

const Book = model('Book', bookSchema);

module.exports = Book;
