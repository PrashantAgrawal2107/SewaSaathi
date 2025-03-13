import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reviewer
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true }, // Reviewed worker
  rating: { type: Number, required: true, min: 1, max: 5 } // Rating 1-5
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
