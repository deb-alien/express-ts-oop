import { Request, Response } from 'express';
import BaseController from '../../core/base-controller';
import { HTTP_METHODS, IRoute } from '../../core/types';

export default class UserController extends BaseController {
	public path = 'users';
	protected readonly routes: IRoute[] = [
		{
			path: '/',
			method: HTTP_METHODS.GET,
			handler: this.getUsers,
			localMiddleware: [],
		},
		{
			path: '/',
			method: HTTP_METHODS.POST,
			handler: this.createUser,
			localMiddleware: [],
		},
	];

	private getUsers(req: Request, res: Response) {
		res.send('List of users ');
	}

	private createUser(req: Request, res: Response) {
		res.send('User Created');
	}
}
