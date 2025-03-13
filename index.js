import express from 'express';
import './env.js';
import { EventEmitter } from 'events'; // Import EventEmitter
import connectDB from './config/db.js'; // MongoDB connection
import loggerMiddleware from './middlewares/loggerMiddleware.js';
import errorHandler from './middlewares/errorHandler.js';
import workerRoutes from './routes/worker.routes.js'; 
import userRoutes from './routes/user.routes.js'; 
import serviceRoutes from './routes/service.routes.js';
import cartRoutes from './routes/cart.routes.js';
import reviewRoutes from './routes/review.routes.js';
import orderRoutes from './routes/order.routes.js';
import swagger from 'swagger-ui-express';
import apiDocs from './swagger.json' assert {type : 'json'};

// Set the maximum number of listeners to a higher value
EventEmitter.defaultMaxListeners = 20; // Increase the limit

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(loggerMiddleware); // Use the logger middleware

// Your routes will be here
app.use("/api-docs", swagger.serve , swagger.setup(apiDocs)); // Documentation Route
app.use('/workers', workerRoutes); 
app.use('/users', userRoutes); 
app.use('/services', serviceRoutes);
app.use('/cart', cartRoutes);
app.use('/review', reviewRoutes);
app.use('/order', orderRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
