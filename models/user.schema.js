import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // Unique username
  email: { type: String, required: true, unique: true },     // User's email
  password: { type: String, required: true },                 // User's password
  phone: { type: String, required: true },                    // User's phone number
  address: { type: String, required: true },                  // User's address
  role: { type: String, default: 'user' },                    // User role (default: 'user')
}, { timestamps: true });

export default mongoose.model('User', userSchema);