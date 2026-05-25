"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// export default [body('email').notEmpty().withMessage('Email is required')];
exports.default = (0, express_validator_1.checkSchema)({
    name: {
        errorMessage: "Name is required",
        notEmpty: true,
    },
    address: {
        errorMessage: "Address is required",
        notEmpty: true,
    },
});
//# sourceMappingURL=tenantValidator.js.map