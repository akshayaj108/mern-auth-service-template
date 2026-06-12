import { checkSchema } from "express-validator";

export default checkSchema({
  firstName: {
    errorMessage: "First name is required",
    notEmpty: true,
  },
  email: {
    errorMessage: "Email should be valid email",
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
