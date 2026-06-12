import { checkSchema } from "express-validator";
import { UpdateUserRequest } from "../types";

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
    notEmpty: true,
    trim: true,
  },
  tenantId: {
    errorMessage: "Tenant Id is required!",
    trim: true,
    custom: {
      options: (value: string, { req }) => {
        const role = (req as UpdateUserRequest).body.role;
        if (role === "admin") {
          return true;
        } else {
          return !!value;
        }
      },
    },
  },
});
