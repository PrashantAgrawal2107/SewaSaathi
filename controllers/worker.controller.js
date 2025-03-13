// controllers/worker.controller.js

import Worker from '../models/worker.schema.js'; // Import the Worker model
import logger from '../config/logger.js'; // Logger for error logging
import errorHandler from '../middlewares/errorHandler.js'; // Custom error handler
import mongoose from 'mongoose';
import CustomError from '../middlewares/customError.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new worker
export const registerWorker = async (req, res, next) => {
    try {
      const { password, ...rest } = req.body;
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new worker with the hashed password
      const newWorker = new Worker({ ...rest, password: hashedPassword });
  
      await newWorker.save();
      res.status(201).json({ message: 'Worker registered successfully', worker: newWorker });
    } catch (error) {
      logger.error(`Error registering worker: ${error.message}`);
      next(new CustomError('Error registering worker', 400, error));
    }
  };

// Login worker 
export const loginWorker = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const worker = await Worker.findOne({ email });
    if (!worker) {
      return next(new CustomError('Invalid email or password', 401));
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) {
      return next(new CustomError('Invalid email or password', 401));
    }

    // Generate JWT
    const token = jwt.sign({ id: worker._id, phone: worker.phone }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, worker: { workername: worker.name, email: worker.email } });
  } catch (error) {
    logger.error(`Error logging in worker: ${error.message}`);
    next(new CustomError('Error logging in worker', 500, error));
  }
};  

// Get worker details by ID
export const getWorkerById = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Validate the ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new CustomError('Invalid worker ID format', 400));
      }
  
      const worker = await Worker.findById(id);
  
      if (!worker) {
        return next(new CustomError('Worker not found', 404));
      }
  
      // Convert worker document to plain object and remove the password
      const workerData = worker.toObject();
      delete workerData.password; // Remove the password from the response
  
      res.status(200).json(workerData);
    } catch (error) {
      logger.error(`Error fetching worker: ${error.message}`);
      next(new CustomError('Error fetching worker details', 500, error));
    }
  };
  

// Get a list of all workers with optional filtering
export const getWorkers = async (req, res, next) => {
    try {
      const { category, location } = req.query;
  
      // Build the filter object
      const filter = {};
  
      // Check if category is provided, then perform case-insensitive match in the skills array
      if (category) {
        filter.skills = { $regex: new RegExp(category, 'i') }; // Case-insensitive matching in the skills array
      }
  
      // If location is provided, add it to the filter
      if (location) {
        filter.location = { $regex: new RegExp(location, 'i') }; // Case-insensitive match for location
      }
  
      // Fetch workers based on the filter
      const workers = await Worker.find(filter);
  
      // Map through workers to remove passwords
      const workersData = workers.map(worker => {
        const workerObj = worker.toObject();
        delete workerObj.password; // Remove the password from each worker
        return workerObj;
      });
  
      res.status(200).json(workersData);
    } catch (error) {
      logger.error(`Error fetching workers: ${error.message}`);
      next(new CustomError('Error fetching workers', 400, error));
    }
  };  
  

// Update worker details
export const updateWorker = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Validate if the ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new CustomError('Invalid Worker ID', 400));
      }
  
      // Check if password is being updated
      if (req.body.password) {
        // Hash the new password before updating
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
  
      const updatedWorker = await Worker.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedWorker) {
        return next(new CustomError('Worker not found', 404));
      }
  
      res.status(200).json({ message: 'Worker updated successfully', worker: updatedWorker });
    } catch (error) {
      logger.error(`Error updating worker: ${error.message}`);
      next(new CustomError('Error updating worker', 400, error));
    }
  };

  export const deleteWorker = async (req , res , next) => {
    try {
      const { id } = req.params;
  
      // Check if the worker exists
      const worker = await Worker.findById(id);
      if (!worker) {
        return next(new CustomError('Worker not found', 404));
      }
  
      // Delete the worker
      await worker.deleteOne();
  
      res.status(200).json({ message: 'Worker deleted successfully' });
    } catch (error) {
      logger.error(`Unable to delete Worker : ${error.message}`);
      next(new CustomError('Error deleting Worker', 400, error));
    }
  }
  
