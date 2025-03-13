import jwt from 'jsonwebtoken';
import CustomError from '../middlewares/customError.js';
import User from '../models/user.schema.js'; 
import Worker from '../models/worker.schema.js';

// Middleware to authenticate user
export const authUser = async (req, res, next) => {
    // Directly extract token from the authorization header
    const token = req.headers.authorization || req.headers.token; // Check for token directly
  
    console.log(token); // Log the token for debugging purposes
  
    if (!token) {
      return next(new CustomError('Authentication failed, token missing', 401));
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
      req.user = await User.findById(decoded.id).select('-password'); // Get user without password
      req.worker = await Worker.findById(decoded.id).select('-password'); // Get worker without password
      if (!req.user && !req.worker) {
        return next(new CustomError('User not found', 404));
      }
      if(!req.user && req.worker) {
        return next(new CustomError('Only admin can delete a worker', 404));
      }
      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      return next(new CustomError('Authentication failed', 401));
    }
  };
  

// Middleware to authenticate admin
export const authAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new CustomError('Access denied. Admins only.', 403));
  }
  next(); // Proceed to the next middleware/route handler
};

// Middleware to authenticate worker
export const authWorker = async (req, res, next) => {
  // Directly extract token from the authorization header
  const token = req.headers.authorization || req.headers.token; // Check for token directly

  console.log(token); // Log the token for debugging purposes

  if (!token) {
    return next(new CustomError('Authentication failed, token missing', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.worker = await Worker.findById(decoded.id).select('-password'); // Get worker without password
    if (!req.worker) {
      return next(new CustomError('Worker not found', 404));
    }
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return next(new CustomError('Authentication failed', 401));
  }
};
