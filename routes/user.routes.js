import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  getUserById, 
  deleteUser, 
  logoutUser 
} from '../controllers/user.controller.js';
import { authUser, authAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// User Profile
router.get('/me', authUser, getUserProfile);
router.put('/me', authUser, updateUserProfile);

// User Management (Admin)
router.get('/', authUser, authAdmin, getAllUsers); // Admin only
router.get('/:id', authUser, authAdmin, getUserById); // Admin only
router.delete('/:id', authUser, authAdmin, deleteUser); // Admin only

// User Logout
router.post('/logout', authUser, logoutUser);

export default router;
