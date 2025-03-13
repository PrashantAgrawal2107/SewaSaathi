import Cart from '../models/cart.schema.js';
import Service from '../models/service.schema.js';
import CustomError from '../middlewares/customError.js';

// Add service to the cart
export const addToCart = async (req, res, next) => {
    const { serviceId, quantity = 1, worker, location } = req.body;
    const userId = req.user._id;
  
    try {
      // Fetch the service being added
      const service = await Service.findById(serviceId);
      if (!service) {
        return next(new CustomError('Service not found', 404));
      }
  
      // Find the user's cart or create a new one if it doesn't exist
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({
          user: userId,
          location: req.user.address, // default to user's location
          miniCarts: [],
          totalPrice: 0,
        });
      } else {
        cart.location = location;
      }
  
      // Check if a mini cart already exists for this category
      const miniCartIndex = cart.miniCarts.findIndex(mc => mc.category === service.category);
  
      if (miniCartIndex === -1) {
        // No mini cart for this category, create a new one with a worker
        if (!worker) {
          return next(new CustomError(`Worker must be provided for category: ${service.category}`, 400));
        }
  
        cart.miniCarts.push({
          category: service.category,
          worker, // Assign the worker to the new mini cart
          services: [{ service: serviceId, quantity }]
        });
      } else {
        // If mini cart for category exists, check if the service already exists
        const serviceIndex = cart.miniCarts[miniCartIndex].services.findIndex(s => s.service.toString() === serviceId);
        
        if (serviceIndex === -1) {
          // Service does not exist, add it to the mini cart
          cart.miniCarts[miniCartIndex].services.push({ service: serviceId, quantity });
        } else {
          // Service already exists, just increase the quantity
          cart.miniCarts[miniCartIndex].services[serviceIndex].quantity += quantity;
        }
      }
  
      // Recalculate total price
      cart.totalPrice = await calculateTotalPrice(cart.miniCarts);
  
      // Save the updated cart
      await cart.save();
  
      res.status(200).json({ message: 'Service added to cart', cart });
    } catch (error) {
      next(new CustomError('Error adding service to cart', 500));
    }
  };
  
  
  // Delete service from cart
  export const deleteFromCart = async (req, res, next) => {
    const { serviceId, quantity = 1 } = req.body; // Quantity to reduce
    const userId = req.user._id;
  
    try {
      // Find the user's cart
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return next(new CustomError('Cart not found', 404));
      }
  
      // Find which mini cart contains the service
      const miniCartIndex = cart.miniCarts.findIndex(mc =>
        mc.services.some(s => s.service.toString() === serviceId)
      );
  
      if (miniCartIndex === -1) {
        return next(new CustomError('Service not found in cart', 404));
      }
  
      // Get the mini cart and find the specific service
      const miniCart = cart.miniCarts[miniCartIndex];
      const serviceIndex = miniCart.services.findIndex(s => s.service.toString() === serviceId);
  
      if (serviceIndex === -1) {
        return next(new CustomError('Service not found in mini cart', 404));
      }
  
      // Decrease the quantity or remove the service if quantity is zero
      if (miniCart.services[serviceIndex].quantity > quantity) {
        // Reduce the quantity by the specified amount
        miniCart.services[serviceIndex].quantity -= quantity;
      } else {
        // If the quantity becomes 0 or less, remove the service
        miniCart.services.splice(serviceIndex, 1);
      }
  
      // If no more services in this mini cart, remove the entire mini cart
      if (miniCart.services.length === 0) {
        cart.miniCarts.splice(miniCartIndex, 1);
      }
  
      // Recalculate total price
      cart.totalPrice = await calculateTotalPrice(cart.miniCarts);
  
      // Save the updated cart
      await cart.save();
  
      res.status(200).json({ message: 'Service removed or quantity reduced', cart });
    } catch (error) {
      next(new CustomError('Error removing service from cart', 500));
    }
  };
  
  
  // Helper function to calculate total price
  const calculateTotalPrice = async (miniCarts) => {
    let total = 0;

    for (let i = 0; i < miniCarts.length; i++) {
        let miniCart = miniCarts[i];
        let categoryTotal = 0;
      
        // Calculate price for all services in this category
        for (let j = 0; j < miniCart.services.length; j++) {
          let svc = miniCart.services[j];
          const service = await Service.findById(svc.service);
          categoryTotal += svc.quantity * service.price;
        }
      
        // Apply 25% discount if more than one service in this category
        if (miniCart.services.length > 1) {
          categoryTotal *= 0.75;
        }
      
        total += categoryTotal;
      }
      
    //  console.log(total);
    //  console.log(isNaN(total));

    return total;
  };

  // Clear Cart
export const clearCart = async (req, res, next) => {
    const userId = req.user._id;

    try {
        // Find the user's cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return next(new CustomError('Cart not found', 404));
        }

        // Clear the mini carts and reset the total price
        cart.miniCarts = [];
        cart.totalPrice = 0;

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: 'Cart cleared successfully', cart });
    } catch (error) {
        next(new CustomError('Error clearing cart', 500));
    }
};

// View Cart
export const viewCart = async (req, res, next) => {
    const userId = req.user._id;

    try {
        // Find the user's cart
        let cart = await Cart.findOne({ user: userId }).populate('miniCarts.services.service miniCarts.worker');
        if (!cart) {
            return next(new CustomError('Cart not found', 404));
        }

        res.status(200).json({ message: 'Cart fetched successfully', cart });
    } catch (error) {
        next(new CustomError('Error fetching cart', 500));
    }
};

// Update cart location or worker for a category
export const updateCart = async (req, res, next) => {
    const { category, workerId, location } = req.body;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return next(new CustomError('Cart not found', 404));
        }

        // Update location if provided
        if (location) {
            cart.location = location;
        }

        if(category){
            // Find the mini cart for the category
            const miniCartIndex = cart.miniCarts.findIndex(mc => mc.category === category);
            if (miniCartIndex === -1) {
                return next(new CustomError('No mini cart found for the specified category', 404));
            }

            // Update worker if provided
            if (workerId) {
                cart.miniCarts[miniCartIndex].worker = workerId;
            }
        }

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        next(new CustomError('Error updating cart', 500));
    }
};
