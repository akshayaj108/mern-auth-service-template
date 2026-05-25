"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// export default [body('email').notEmpty().withMessage('Email is required')];
exports.default = (0, express_validator_1.checkSchema)({
    email: {
        errorMessage: "Email is required",
        notEmpty: true,
        trim: true,
        isEmail: {
            errorMessage: "Email should be a valid",
        },
    },
    pass: {
        errorMessage: "Password is required",
        notEmpty: true,
        trim: true,
    },
});
//# sourceMappingURL=loginValidator.js.map