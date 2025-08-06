import chalk from 'chalk';
import { Router } from 'express';
import { IRoute } from './types';

export default abstract class BaseController {
	public router: Router = Router();
	public abstract path: string;
	protected abstract readonly routes: IRoute[];

	public get name(): string {
		return this.constructor.name;
	}

	public setRoutes(prefixPath = ''): Router {
		for (const route of this.routes) {
			const { path, method, handler, localMiddleware } = route;

			if (typeof this.router[method] !== 'function') {
				console.error(
					chalk.red(
						`[Routing Error] Invalid HTTP method "${method}" used in route "${path}" of controller "${this.constructor.name}".`
					)
				);
				continue;
			}
			const fullPath = `${prefixPath}${path}`.replace(/\/+/g, '/');
			const routeHandlers = [...localMiddleware, handler.bind(this)];

			this.router[method](path, ...routeHandlers);

			console.log(
				`${chalk.greenBright(`[${this.name}] Route`)} ${chalk.cyanBright(
					`[${method.toUpperCase()}]`
				)} ${chalk.yellowBright(fullPath)}`
			);
		}

		return this.router;
	}
}
