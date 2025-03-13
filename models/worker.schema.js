import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Password for authentication
  phone: { type: String, required: true },
  skills: [{ type: String, required: true }], // List of skills (e.g., plumbing, carpentry)
  location: { type: String, required: true }, // Location of the worker
  onboarding: {
    documents: { type: [String], required: true }, // Required documents for onboarding
    quizScore: { type: Number, required: true },   // Quiz score
    status: { type: String, default: 'pending' },  // Onboarding status (pending/approved/rejected)
  },
  availability: { type: Boolean, default: true }, // Worker availability
}, { timestamps: true });

export default mongoose.model('Worker', workerSchema);

