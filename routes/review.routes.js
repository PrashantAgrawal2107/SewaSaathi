import express from 'express';
import { addReview, deleteReview, updateReview, getWorkerReviews, getUserReviews } from '../controllers/review.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route to add a review
router.post('/add', authUser, addReview);

// Route to delete a review by ID
router.delete('/delete/:reviewId', authUser, deleteReview);

// Route to update a review by ID
router.put('/update/:reviewId', authUser, updateReview);

// Route to get all reviews for a specific worker
router.get('/worker/:workerId', getWorkerReviews);

// Route to get all reviews by a specific user
router.get('/user', authUser, getUserReviews);

export default router;
