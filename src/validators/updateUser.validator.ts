import { checkSchema } from "express-validator";

export default checkSchema({
  firstName: {
    errorMessage: "First name is required",
    optional: true,
    notEmpty: true,
  },
  lastName: {
    errorMessage: "Last name is required",
    optional: true,
    notEmpty: true,
  },
  email: {
    errorMessage: "Email is required",
    optional: true,
    notEmpty: true,
    trim: true,
    isEmail: true,
  },
  pass: {
    errorMessage: "Password is required",
    optional: true,
    notEmpty: true,
    trim: true,
  },
  role: {
    errorMessage: "Role is required!",
    optional: true,
    notEmpty: true,
    trim: true,
  },
});
