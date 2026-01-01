"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (role) => {
    return (req, res, next) => {
        // Add role check logic here
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=requireRole.js.map