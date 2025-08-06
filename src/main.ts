import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, RequestHandler } from 'express';
import morgan from 'morgan';

import { appConfig } from './config/app.config';
import BaseController from './core/base-controller';
import Server from './core/server';
import errorHandler from './middlewares/errorHandler';
import UserController from './modules/user/user.controller';

const app: Application = express();
const PORT = appConfig.port;

const controllers: BaseController[] = [new UserController()];

const globalMiddleware: RequestHandler[] = [
	express.json(),
	express.urlencoded({ extended: false }),
	cors(),
	cookieParser(),
	morgan(':method :url :status :res[content-length] - :response-time ms'),
];

const server = new Server(app, PORT);
async function bootstrap() {
	await server.ConnectDB()
	server.LoadMiddleware(globalMiddleware);
	server.LoadControllers(controllers);
	server.AddErrorHandler(errorHandler);
	server.run();
}

bootstrap();
