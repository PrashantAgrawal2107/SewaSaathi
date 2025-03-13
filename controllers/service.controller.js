import mongoose from 'mongoose';
import Service from '../models/service.schema.js'; // Adjust the path
import CustomError from '../middlewares/customError.js';
import logger from '../config/logger.js';

// Add New Service
export const addService = async (req, res, next) => {
  const { category, name, price, description } = req.body;

  try {
    const newService = new Service({
      category,
      name,
      price,
      description
    });

    await newService.save();
    res.status(201).json({ message: 'Service added successfully', service: newService });
  } catch (error) {
    logger.error(`Error adding service: ${error.message}`);
    next(new CustomError('Error adding service', 500, error));
  }
};

// Get All Services
export const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    logger.error(`Error fetching services: ${error.message}`);
    next(new CustomError('Error fetching services', 500, error));
  }
};

// Get Services by Category
export const getServicesByCategory = async (req, res, next) => {
    const { category } = req.params;
  
    try {
      // Use a regular expression for case-insensitive matching
      const services = await Service.find({ category: { $regex: new RegExp(`^${category}$`, 'i') } });
  
      if (services.length === 0) {
        return next(new CustomError('No services found for this category', 404));
      }
      res.status(200).json(services);
    } catch (error) {
      logger.error(`Error fetching services by category: ${error.message}`);
      next(new CustomError('Error fetching services by category', 500, error));
    }
  };
  

// Search Services
export const searchServices = async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new CustomError('Search query is required', 400));
  }

  try {
    const services = await Service.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search on name
        { description: { $regex: query, $options: 'i' } } // Case-insensitive search on description
      ]
    });

    if (services.length === 0) {
      return next(new CustomError('No services found matching the search criteria', 404));
    }

    res.status(200).json(services);
  } catch (error) {
    logger.error(`Error searching services: ${error.message}`);
    next(new CustomError('Error searching services', 500, error));
  }
};

// Get Service by ID
export const getServiceById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError('Invalid service ID', 400));
  }

  try {
    const service = await Service.findById(id);
    if (!service) {
      return next(new CustomError('Service not found', 404));
    }

    res.status(200).json(service);
  } catch (error) {
    logger.error(`Error fetching service by ID: ${error.message}`);
    next(new CustomError('Error fetching service by ID', 500, error));
  }
};

// Update Service
export const updateService = async (req, res, next) => {
  const { id } = req.params;
  const { category, name, price, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError('Invalid service ID', 400));
  }

  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { category, name, price, description },
      { new: true }
    );

    if (!updatedService) {
      return next(new CustomError('Service not found', 404));
    }

    res.status(200).json({ message: 'Service updated successfully', service: updatedService });
  } catch (error) {
    logger.error(`Error updating service: ${error.message}`);
    next(new CustomError('Error updating service', 500, error));
  }
};

// Delete Service
export const deleteService = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError('Invalid service ID', 400));
  }

  try {
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return next(new CustomError('Service not found', 404));
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting service: ${error.message}`);
    next(new CustomError('Error deleting service', 500, error));
  }
};
