class CustomError extends Error {
    constructor(message, statusCode, originalError = null) {
      super(message); // Call the parent class (Error) constructor with the message
      this.statusCode = statusCode; // Set custom status code
      this.originalError = originalError; // Store the original error if available
    }
  }
  
  export default CustomError;
  