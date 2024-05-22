import {type Request, type Response, type NextFunction} from 'express';
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	message: 'Too many attempts from this ip, Please try again in 15 minutes',
	keyGenerator: (req: Request) => req.ip ?? 'unknown',
	handler(_req: Request, res: Response, _next: NextFunction) {
		return res.status(429).json({error: 'Too many attempts from this IP. Please try again in 15 minutes'});
	},
});
