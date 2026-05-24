import { checkSchema } from "express-validator";

// export default [body('email').notEmpty().withMessage('Email is required')];
export default checkSchema({
  name: {
    errorMessage: "Name is required",
    notEmpty: true,
  },
  address: {
    errorMessage: "Address is required",
    notEmpty: true,
  },
});
