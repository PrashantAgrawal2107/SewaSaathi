import express from 'express';
import {
  addService,
  getAllServices,
  getServicesByCategory,
  searchServices,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/service.controller.js';
import { authUser, authAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Add Service (Admin)
router.post('/', authUser, authAdmin, addService);

// Get All Services
router.get('/', getAllServices);

// Get Services by Category
router.get('/category/:category', getServicesByCategory);

// Search Services
router.get('/search', searchServices);

// Get Service by ID
router.get('/:id', getServiceById);

// Update Service (Admin)
router.put('/:id', authUser, authAdmin, updateService);

// Delete Service (Admin)
router.delete('/:id', authUser, authAdmin, deleteService);

export default router;
