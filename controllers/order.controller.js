import Order from '../models/order.schema.js';
import Cart from '../models/cart.schema.js';
import stripe from 'stripe';
import CustomError from '../middlewares/customError.js';

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Create new order
export const createOrder = async (req, res, next) => {
  const userId = req.user._id;

  try {
    // Fetch the cart for the user
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return next(new CustomError('Cart not found', 404));
    }

    // Create a new order without payment processing for now
    const newOrder = await Order.create({
      user: userId,
      cart: cart._id,
      amount: cart.totalPrice,
      paymentMethod: "none"
    });

    res.status(200).json({ message: 'Order created', order: newOrder });
  } catch (error) {
    next(new CustomError('Error creating order', 500));
  }
};

// Mark order as completed by the worker (only admin or worker can do this)
export const completeOrder = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    // Find the order and check if it exists
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new CustomError('Order not found', 404));
    }

    // Update the order status to completed
    order.orderStatus = 'completed';

    // Save the updated order
    await order.save();

    res.status(200).json({ message: 'Order marked as completed' });
  } catch (error) {
    next(new CustomError('Error completing the order', 500));
  }
};

// Handle payment after order is completed
export const processPayment = async (req, res, next) => {
  const { orderId, paymentMethod } = req.body;

  try {
    // Find the order
    const order = await Order.findById(orderId).populate('cart');
    if (!order) {
      return next(new CustomError('Order not found', 404));
    }

    if (order.orderStatus !== 'completed') {
      return next(new CustomError('Order must be marked as completed before payment', 400));
    }

    // Process the payment using Stripe
    const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: Math.round(order.amount * 100),  // Stripe expects amount in paise for INR (1 INR = 100 paise)
        currency: 'inr',  // Set currency to INR
        payment_method_types: [paymentMethod],  // Payment method (e.g., card, UPI, etc.)
    });

    // Update payment status
    order.paymentMethod = paymentMethod;
    order.paymentStatus = 'completed';
    order.transactionId = paymentIntent.id;

    // Save the updated order
    await order.save();

    res.status(200).json({ message: 'Payment successful', order });
  } catch (error) {
    next(new CustomError('Payment failed', 500));
  }
};

// Refund the payment and cancel the order
export const cancelOrder = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new CustomError('Order not found', 404));
    }

    if (order.paymentStatus === 'completed') {
      // Refund the payment using Stripe
      const refund = await stripeInstance.refunds.create({
        payment_intent: order.transactionId,
      });

      // Update payment status
      order.paymentStatus = 'refunded';
    }

    // Cancel the order
    order.orderStatus = 'cancelled';

    // Save the updated order
    await order.save();

    res.status(200).json({ message: 'Order cancelled and payment refunded', order });
  } catch (error) {
    next(new CustomError('Error cancelling the order', 500));
  }
};


// Get order by ID
export const getOrderById = async (req, res, next) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId).populate('cart');
        if (!order) {
            return next(new CustomError('Order not found', 404));
        }

        res.status(200).json({ order });
    } catch (error) {
        next(new CustomError('Error fetching order', 500));
    }
};

// Get orders by user
export const getUserOrders = async (req, res, next) => {
    const userId = req.user._id;
    
    try {
        const orders = await Order.find({ user: userId }).populate('cart');
        res.status(200).json({ orders });
    } catch (error) {
        next(new CustomError('Error fetching orders', 500));
    }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('cart');
        res.status(200).json({ orders });
    } catch (error) {
        next(new CustomError('Error fetching orders', 500));
    }
};

// Get orders by status (Admin only)
export const getOrdersByStatus = async (req, res, next) => {
    const { status } = req.params;

    try {
        const orders = await Order.find({ orderStatus : status }).populate('cart');
        res.status(200).json({ orders });
    } catch (error) {
        next(new CustomError('Error fetching orders by status', 500));
    }
};