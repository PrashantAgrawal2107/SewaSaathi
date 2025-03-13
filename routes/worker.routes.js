// routes/worker.routes.js

import express from 'express';
import {
  registerWorker,
  loginWorker,
  getWorkerById,
  getWorkers,
  updateWorker,
  deleteWorker
} from '../controllers/worker.controller.js';
import { validateWorker } from '../middlewares/worker.middleware.js'; // Add any middleware needed
import { authAdmin , authUser, authWorker } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Register a new worker (Onboarding)
router.post('/', validateWorker, registerWorker);

// Login worker 
router.post('/login' , loginWorker);

// Get worker details by ID
router.get('/:id', getWorkerById);

// Get a list of all workers with optional query parameters for filtering
router.get('/', getWorkers);

// Update worker details (Only Worker)
router.patch('/:id', authWorker , updateWorker);

// Delete a worker (Only Admin)
router.delete('/:id', authUser, authAdmin, deleteWorker);

export default router;
