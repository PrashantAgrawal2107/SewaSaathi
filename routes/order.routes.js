import express from 'express';
import { 
    createOrder,
    completeOrder,
    processPayment,
    cancelOrder, 
    getOrderById, 
    getUserOrders, 
    getAllOrders, 
    getOrdersByStatus
} from '../controllers/order.controller.js';

import { authUser, authAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Create a new order (user)
router.post('/create', authUser, createOrder);

// Mark order as completed (admin/worker)
router.put('/complete/:orderId', authUser, authAdmin, completeOrder);

// Process payment for completed order (user)
router.post('/pay', authUser, processPayment);

// Cancel order and refund (user/admin)
router.delete('/cancel/:orderId', authUser, cancelOrder);

// Route to get all orders by a specific user (User only)
router.get('/history', authUser, getUserOrders);

// Route to get an order by ID (User/Admin)
router.get('/:orderId', authUser, getOrderById);

// Route to get all orders (Admin only)
router.get('/', authUser, authAdmin, getAllOrders);

// Route to get orders by status (Admin only)
router.get('/status/:status', authUser, authAdmin, getOrdersByStatus);

export default router;
