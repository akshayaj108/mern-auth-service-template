"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// export default [body('email').notEmpty().withMessage('Email is required')];
exports.default = (0, express_validator_1.checkSchema)({
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
//# sourceMappingURL=updateUser.validator.js.map