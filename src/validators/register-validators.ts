import { checkSchema } from "express-validator";

// export default [body('email').notEmpty().withMessage('Email is required')];
export default checkSchema({
  firstName: {
    errorMessage: "First name is required",
    notEmpty: true,
  },
  email: {
    errorMessage: "Email is required",
    notEmpty: true,
    trim: true,
    isEmail: true,
  },
  pass: {
    errorMessage: "Password is required",
    notEmpty: true,
    trim: true,
  },
});
