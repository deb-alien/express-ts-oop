import { NextFunction, Request, Response } from 'express';

export default function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
	res.status(err.statusCode || 500).json({
		message: err.message || 'Something went wrong.',
		stack: err.stack,
	});
}
