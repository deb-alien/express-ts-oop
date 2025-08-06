"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_config_1 = require("../config/app.config");
class Server {
    constructor(app, port) {
        this.app = app;
        this.port = port;
    }
    LoadMiddleware(middlewares) {
        middlewares.forEach((middleware) => {
            this.app.use(middleware);
        });
    }
    LoadControllers(controllers) {
        controllers.forEach((controller) => {
            const fullURLPath = `/${controller.path.replace(/\/+$/, '')}`;
            this.app.use(fullURLPath, controller.setRoutes());
        });
    }
    AddErrorHandler(errorHandler) {
        const handler = Array.isArray(errorHandler) ? errorHandler : [errorHandler];
        handler.forEach((handler) => {
            this.app.use(handler);
        });
    }
    async ConnectDB() {
        try {
            const conn = await mongoose_1.default.connect(app_config_1.appConfig.mongoURI);
            console.log(`${chalk_1.default.greenBright('[Database Connected]')} ${chalk_1.default.cyanBright(`[HOST]: ${conn.connection.host}`)} ${chalk_1.default.yellowBright(`[NAME]: ${conn.connection.name}`)}`);
        }
        catch (error) {
            console.log(chalk_1.default.red('Database Connection Error'), error);
            process.exit(1);
        }
    }
    run() {
        return this.app.listen(this.port, () => {
            console.log(`Server is running on ${chalk_1.default.cyan(`http://localhost:${this.port}/`)}`);
        });
    }
}
exports.default = Server;
