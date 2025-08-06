import chalk from 'chalk';
import { Application, ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import http from 'node:http';
import { appConfig } from '../config/app.config';
import BaseController from './base-controller';

export default class Server {
	private app: Application;
	private port: number;

	constructor(app: Application, port: number) {
		this.app = app;
		this.port = port;
	}

	public LoadMiddleware(middlewares: RequestHandler[]): void {
		middlewares.forEach((middleware) => {
			this.app.use(middleware);
		});
	}

	public LoadControllers(controllers: BaseController[]): void {
		controllers.forEach((controller) => {
			const fullURLPath = `/${controller.path.replace(/\/+$/, '')}`;
			this.app.use(fullURLPath, controller.setRoutes());
		});
	}

	public AddErrorHandler(errorHandler: ErrorRequestHandler | ErrorRequestHandler[]): void {
		const handler = Array.isArray(errorHandler) ? errorHandler : [errorHandler];
		handler.forEach((handler) => {
			this.app.use(handler);
		});
	}

	public async ConnectDB(): Promise<void> {
		try {
			const conn = await mongoose.connect(appConfig.mongoURI);
			console.log(
				`${chalk.greenBright('[Database Connected]')} ${chalk.cyanBright(
					`[HOST]: ${conn.connection.host}`
				)} ${chalk.yellowBright(`[NAME]: ${conn.connection.name}`)}`
			);
		} catch (error) {
			console.log(chalk.red('Database Connection Error'), error);
			process.exit(1);
		}
	}

	public run(): http.Server {
		return this.app.listen(this.port, () => {
			console.log(`Server is running on ${chalk.cyan(`http://localhost:${this.port}/`)}`);
		});
	}
}
