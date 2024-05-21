/* eslint-disable @typescript-eslint/naming-convention */
import {type Request, type Response, type NextFunction} from 'express';
import {type JwtPayload, type AuthRequest, type User} from '../types/authTypes';
import jwt from 'jsonwebtoken';
import {generateAccessToken} from './generateToken';
import dotenv from 'dotenv';
dotenv.config({path: 'src/.env'});

const {JWT_SECRET} = process.env;

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined');
	}

	try {
		const {accessToken, refreshToken} = req.cookies;

		if (!accessToken || !refreshToken) {
			return res.status(401).json({error: 'No token present'});
		}

		if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
			return res.status(401).json({error: 'Invalid token format'});
		}

		jwt.verify(accessToken, JWT_SECRET, (error, decoded) => {
			if (error) {
				if (error.name === 'TokenExpiredError') {
					jwt.verify(refreshToken, JWT_SECRET, async (refreshError, refreshDecoded) => {
						if (refreshError) {
							return res.status(401).json({error: 'Invalid refresh token'});
						}

						const {iat, exp, ...decodedUser} = refreshDecoded as JwtPayload;
						const user = decodedUser as User;
						const newAccessToken = await generateAccessToken(user);

						res.cookie('accessToken', newAccessToken, {httpOnly: true, maxAge: 3600000, sameSite: 'strict'});
						(req as AuthRequest).user = user;
						next();
					});
				} else {
					throw new Error('Invalid access token');
				}
			} else {
				const {iat, exp, ...decodedUser} = decoded as JwtPayload;
				(req as AuthRequest).user = decodedUser as User;
				next();
			}
		});
	} catch (error) {
		if (error instanceof Error) {
			return res.status(401).json({error: error.message});
		}
	}
};
