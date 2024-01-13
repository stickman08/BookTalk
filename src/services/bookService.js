const Book = require('../models/Book');

exports.getAll = () => Book.find({});

exports.getReviewById = (id) => Book.findById(id);

exports.createReview = (reviewData, owner) => Book.create({ ...reviewData, owner });

exports.editReview = (id, reviewData) => Book.findOneAndUpdate(id, reviewData);

exports.deleteReview = (id) => Book.findByIdAndDelete(id);

exports.wishReview = async (reviewId, userId) => {
    const book = await Book.findById(reviewId);
    if (!book) throw new Error('Book review not found');

    // Add the current user's ID to the book's wishers array
    if (!book.wishingList.includes(userId)) {
        console.log(book.wishingList);
        book.wishingList.push(userId);
        console.log(book.wishingList);
    }

    await book.save();
    return book;
}
