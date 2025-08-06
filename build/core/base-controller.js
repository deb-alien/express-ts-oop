"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const express_1 = require("express");
class BaseController {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    get name() {
        return this.constructor.name;
    }
    setRoutes(prefixPath = '') {
        for (const route of this.routes) {
            const { path, method, handler, localMiddleware } = route;
            if (typeof this.router[method] !== 'function') {
                console.error(chalk_1.default.red(`[Routing Error] Invalid HTTP method "${method}" used in route "${path}" of controller "${this.constructor.name}".`));
                continue;
            }
            const fullPath = `${prefixPath}${path}`.replace(/\/+/g, '/');
            const routeHandlers = [...localMiddleware, handler.bind(this)];
            this.router[method](path, ...routeHandlers);
            console.log(`${chalk_1.default.greenBright(`[${this.name}] Route`)} ${chalk_1.default.cyanBright(`[${method.toUpperCase()}]`)} ${chalk_1.default.yellowBright(fullPath)}`);
        }
        return this.router;
    }
}
exports.default = BaseController;
