import Review from '../models/review.schema.js';
import CustomError from '../middlewares/customError.js';

// Add a new review
export const addReview = async (req, res, next) => {
    const { workerId, rating } = req.body;
    const userId = req.user._id;

    try {
        const review = new Review({
            user: userId,
            worker: workerId,
            rating,
        });

        await review.save();
        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        next(new CustomError('Error adding review', 500));
    }
};

// Delete a review
export const deleteReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.user._id;

    try {
        const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });

        if (!review) {
            return next(new CustomError('Review not found or not authorized to delete', 404));
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        next(new CustomError('Error deleting review', 500));
    }
};

// Update a review
export const updateReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const { rating } = req.body;
    const userId = req.user._id;

    try {
        const review = await Review.findOneAndUpdate(
            { _id: reviewId, user: userId },
            { rating },
            { new: true }
        );

        if (!review) {
            return next(new CustomError('Review not found or not authorized to update', 404));
        }

        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        next(new CustomError('Error updating review', 500));
    }
};

// Get all reviews for a worker
export const getWorkerReviews = async (req, res, next) => {
    const { workerId } = req.params;

    try {
        const reviews = await Review.find({ worker: workerId }).populate('user', 'name');

        if (reviews.length === 0) {
            return next(new CustomError('No reviews found for this worker', 404));
        }

        res.status(200).json({ reviews });
    } catch (error) {
        next(new CustomError('Error fetching reviews', 500));
    }
};

// Get all reviews posted by a user
export const getUserReviews = async (req, res, next) => {
    const userId = req.user._id;

    try {
        const reviews = await Review.find({ user: userId }).populate('worker', 'name');

        if (reviews.length === 0) {
            return next(new CustomError('No reviews found for this user', 404));
        }

        res.status(200).json({ reviews });
    } catch (error) {
        next(new CustomError('Error fetching user reviews', 500));
    }
};
