"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = (0, express_validator_1.checkSchema)({
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
//# sourceMappingURL=updateTenanatValidator.js.map