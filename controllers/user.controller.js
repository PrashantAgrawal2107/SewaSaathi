import User from '../models/user.schema.js'; // Adjust the path as necessary
import CustomError from '../middlewares/customError.js'; // Custom error handler
import logger from '../config/logger.js'; // Logger for error handling
import bcrypt from 'bcrypt'; // For password hashing
import jwt from 'jsonwebtoken'; // For generating JWTs
import mongoose from 'mongoose'; // For checking ObjectID validity

// User Registration
export const registerUser = async (req, res, next) => {
  const { username, email, password, phone, address } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(new CustomError('Username or email already exists', 400));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({ message: 'User registered successfully', user: { username: user.username, email: user.email } });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    next(new CustomError('Error registering user', 500, error));
  }
};

// User Login
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError('Invalid email or password', 401));
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new CustomError('Invalid email or password', 401));
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, user: { username: user.username, email: user.email } });
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`);
    next(new CustomError('Error logging in user', 500, error));
  }
};

// Get User Profile
export const getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user); // Send user profile excluding password
};

// Update User Profile
export const updateUserProfile = async (req, res, next) => {
  const { phone, address , username } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { phone, address , username }, { new: true }).select('-password');
    if (!updatedUser) {
      return next(new CustomError('User not found', 404));
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error(`Error updating user profile: ${error.message}`);
    next(new CustomError('Error updating user profile', 500, error));
  }
};

// Get All Users (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    next(new CustomError('Error fetching users', 400, error));
  }
};

// Get User by ID (Admin)
export const getUserById = async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectID
  if (!mongoose.isValidObjectId(id)) {
    return next(new CustomError('Invalid user ID', 400));
  }

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return next(new CustomError('User not found', 404));
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching user by ID: ${error.message}`);
    next(new CustomError('Error fetching user by ID', 400, error));
  }
};

// Delete User (Admin)
export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectID
  if (!mongoose.isValidObjectId(id)) {
    return next(new CustomError('Invalid user ID', 400));
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return next(new CustomError('User not found', 404));
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);
    next(new CustomError('Error deleting user', 400, error));
  }
};

// User Logout
export const logoutUser = async (req, res, next) => {
  // For logging out, you can simply invalidate the token on the client side
  res.status(200).json({ message: 'Logged out successfully' });
};

