"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const app_config_1 = require("./config/app.config");
const server_1 = __importDefault(require("./core/server"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const user_controller_1 = __importDefault(require("./modules/user/user.controller"));
const app = (0, express_1.default)();
const PORT = app_config_1.appConfig.port;
const controllers = [new user_controller_1.default()];
const globalMiddleware = [
    express_1.default.json(),
    express_1.default.urlencoded({ extended: false }),
    (0, cors_1.default)(),
    (0, cookie_parser_1.default)(),
    (0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms'),
];
const server = new server_1.default(app, PORT);
async function bootstrap() {
    await server.ConnectDB();
    server.LoadMiddleware(globalMiddleware);
    server.LoadControllers(controllers);
    server.AddErrorHandler(errorHandler_1.default);
    server.run();
}
bootstrap();
