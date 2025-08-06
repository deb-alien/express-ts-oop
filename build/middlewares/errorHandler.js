"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
function errorHandler(err, _req, res, _next) {
    res.status(err.statusCode || 500).json({
        message: err.message || 'Something went wrong.',
        stack: err.stack,
    });
}
