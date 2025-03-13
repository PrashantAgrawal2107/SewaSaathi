import mongoose from 'mongoose';

// MongoDB connection string (use .env for security)
const MONGODB_URI = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connection successful');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Gracefully exit on failure
  }
};

export default connectDB;


