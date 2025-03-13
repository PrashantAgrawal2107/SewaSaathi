import { body, validationResult } from 'express-validator';

export const validateWorker = [
  body('name')
    .isString().withMessage('Name must be a string')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    
  body('email')
    .isEmail().withMessage('Email must be valid'),

  body('phone')
    .isMobilePhone().withMessage('Must be a valid phone number'),

  body('skills')
    .isArray({ min: 1 }).withMessage('At least one skill is required'),

  body('location')
    .isString().withMessage('Location must be a string')
    .notEmpty().withMessage('Location is required'),

  body('onboarding.documents')
    .isArray({ min: 1 }).withMessage('At least one document is required'),

  body('onboarding.quizScore')
    .isNumeric().withMessage('Quiz score must be a number'),

  body('onboarding.status')
    .isString().withMessage('Onboarding status must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

