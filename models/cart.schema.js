import mongoose from 'mongoose';

const miniCartSchema = new mongoose.Schema({
  category: { type: String, required: true }, // Category of services
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true }, // Assigned worker for this category
  services: [{
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }, // Service ID
    quantity: { type: Number, default: 1, required: true }, // Quantity of the service
  }]
}, { _id: false }); // No separate _id for mini carts

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID
  location: { type: String, required: true }, // Default to user's location, changeable
  miniCarts: [miniCartSchema], // Array of mini carts based on categories
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }, // Cart status
  totalPrice: { type: Number, required: true, default: 0 }, // Total price for all services
}, { timestamps: true });

// Custom validation to ensure one mini cart per category
cartSchema.pre('save', function(next) {
  const categories = new Set();
  this.miniCarts.forEach(miniCart => {
    if (categories.has(miniCart.category)) {
      return next(new Error(`Duplicate mini cart for category: ${miniCart.category}`));
    }
    categories.add(miniCart.category);
  });
  next();
});

export default mongoose.model('Cart', cartSchema);
