// controllers/location.controller.js

import User from '../models/user.schema.js';
import Worker from '../models/worker.schema.js';
import CustomError from '../middlewares/customError.js';

// Update worker location
export const updateWorkerLocation = async (req, res, next) => {
  const { lat, lng } = req.body;
  const workerId = req.worker._id; // Assuming auth middleware for worker

  try {
    const worker = await Worker.findById(workerId);
    if (!worker) return next(new CustomError('Worker not found', 404));

    worker.location = { lat, lng };
    await worker.save();
    
    res.status(200).json({ message: 'Worker location updated successfully' });
  } catch (error) {
    next(new CustomError('Failed to update location', 500));
  }
};

// Get worker location (for user)
export const getWorkerLocation = async (req, res, next) => {
  const { workerId } = req.params;

  try {
    const worker = await Worker.findById(workerId);
    if (!worker) return next(new CustomError('Worker not found', 404));

    res.status(200).json({ location: worker.location });
  } catch (error) {
    next(new CustomError('Failed to fetch worker location', 500));
  }
};

// Update user location (in case the user changes it)
export const updateUserLocation = async (req, res, next) => {
  const { lat, lng } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return next(new CustomError('User not found', 404));

    user.location = { lat, lng };
    await user.save();

    res.status(200).json({ message: 'User location updated successfully' });
  } catch (error) {
    next(new CustomError('Failed to update location', 500));
  }
};
