import express from 'express';
import { addToCart, deleteFromCart, clearCart, viewCart, updateCart } from '../controllers/cart.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route to add service to cart
router.post('/add', authUser, addToCart);

// Route to delete service from cart
router.delete('/remove', authUser, deleteFromCart);

// Route to clear entire cart
router.delete('/clear', authUser, clearCart);

// Route to view cart
router.get('/view', authUser, viewCart);

// Route to update cart (location or worker for a category)
router.put('/update', authUser, updateCart);

export default router;

