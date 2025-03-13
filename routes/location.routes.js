// routes/location.routes.js
import express from 'express';
import { updateWorkerLocation, getWorkerLocation, updateUserLocation } from '../controllers/location.controller.js';
import { authUser, authWorker } from '../middlewares/auth.middleware.js'; // Assuming you have these

const router = express.Router();

// Worker updates location
router.put('/worker', authWorker, updateWorkerLocation);

// Get worker's location (for user)
router.get('/worker/:workerId', authUser, getWorkerLocation);

// User updates location
router.put('/user', authUser, updateUserLocation);

export default router;
