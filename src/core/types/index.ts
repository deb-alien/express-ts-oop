import { NextFunction, Request, Response } from 'express';

export enum HTTP_METHODS {
	ALL = 'all',
	GET = 'get',
	POST = 'post',
	PUT = 'put',
	DELETE = 'delete',
	PATCH = 'patch',
	OPTIONS = 'options',
	HEAD = 'head',
}

export interface IRoute {
	path: string;
	method: HTTP_METHODS;
	handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
	localMiddleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
}

export interface AppError extends Error {
	statusCode?: number;
	code?: string | number;
	details?: any;
}
