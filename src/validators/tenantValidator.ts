import { checkSchema } from "express-validator";

export default checkSchema({
  name: {
    notEmpty: {
      errorMessage: "Name is required",
    },
  },
  address: {
    notEmpty: {
      errorMessage: "Address is required",
    },
  },
});
