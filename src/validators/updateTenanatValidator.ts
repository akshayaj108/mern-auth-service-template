import { checkSchema } from "express-validator";

export default checkSchema({
  name: {
    optional: true,
    notEmpty: {
      errorMessage: "Name is required",
    },
  },

  address: {
    optional: true,
    notEmpty: {
      errorMessage: "Address is required",
    },
  },
});
