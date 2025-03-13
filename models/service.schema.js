import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  category: { type: String, required: true },  // E.g., Plumbing, Carpentry
  name: { type: String, required: true, unique: true },      // Name of the service (e.g., Pipe Fixing)
  price: { type: Number, required: true },     // Base price of the service
  description: { type: String, required: true }, // Description of the service
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
