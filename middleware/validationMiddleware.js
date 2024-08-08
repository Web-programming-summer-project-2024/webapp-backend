
/**
 * Middleware to validate query parameters.
 * Checks if the provided query parameters meet specific criteria.
 * If validation fails, returns a 400 response with detailed error messages.
 */


const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));
    return res.status(400).json({ message: 'Validation error', errors: validationErrors });
  }
  next();
};

module.exports = {
    validate,
};
