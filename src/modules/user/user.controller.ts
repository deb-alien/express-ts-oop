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
		{
			path: '/:id',
			method: HTTP_METHODS.GET,
			handler: this.getUserById,
			localMiddleware: [],
		},
	];

	private getUsers(req: Request, res: Response) {
		res.send('get users');
	}

	private createUser(req: Request, res: Response) {
		res.send('create users');
	}

	private getUserById(req: Request, res: Response) {
		res.send('get user by id');
	}
}
