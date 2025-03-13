import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },  // Reference to the user's cart
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // The user who made the order
  amount: { type: Number, required: true },  // Total payment amount (from cart total)
  paymentMethod: { type: String, required: true },  // E.g., Card, UPI, Net Banking
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },  // Payment status
  orderStatus: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },  // Order status
  transactionId: { type: String },  // Transaction ID for reference (optional)
  orderDate: { type: Date, default: Date.now },  // Date of order initiation
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
