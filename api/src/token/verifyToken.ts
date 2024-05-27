/* eslint-disable @typescript-eslint/naming-convention */
import {type Request, type Response, type NextFunction} from 'express';
import {type JwtPayload, type AuthRequest, type User} from '../types/authTypes';
import {queryDatabase} from '../database/initializeDatabase';
import {generateAccessToken} from './generateToken';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({path: 'src/.env'});

const {JWT_SECRET} = process.env;

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined');
	}

	try {
		const {accessToken, refreshToken} = req.cookies as {
			accessToken: string | undefined;
			refreshToken: string | undefined;
		};

		if (!accessToken && !refreshToken) {
			return res.status(401).json({error: 'No token present'});
		}

		if (accessToken) {
			jwt.verify(accessToken, JWT_SECRET, async (error, decoded) => {
				if (error) {
					if (error.name === 'TokenExpiredError') {
						if (refreshToken) {
							jwt.verify(refreshToken, JWT_SECRET, async (refreshError, refreshDecoded) => {
								if (refreshError) {
									return res.status(401).json({error: 'Invalid refresh token'});
								}

								const {iat, exp, ...decodedUser} = refreshDecoded as JwtPayload;
								const user = decodedUser as User;

								const existingUser = await queryDatabase(`
									SELECT username FROM zynqa_users
									WHERE username = $1
								`, [user.username]);

								if (!existingUser.rows[0]) {
									return res.status(401).json({error: 'No user present'});
								}

								const newAccessToken = await generateAccessToken(user);

								res.cookie('accessToken', newAccessToken, {httpOnly: true, maxAge: 5 * 60 * 1000, sameSite: 'strict'});
								res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict'});
								(req as AuthRequest).user = user;
								next();
							});
						}
					} else {
						throw new Error('Invalid access token');
					}
				} else {
					const {iat, exp, ...decodedUser} = decoded as JwtPayload;
					const user = decodedUser as User;

					const existingUser = await queryDatabase(`
						SELECT password FROM zynqa_users
						WHERE username = $1
					`, [user.username]);

					if (!existingUser.rows[0]) {
						return res.status(401).json({error: 'No user present'});
					}

					res.cookie('accessToken', accessToken, {httpOnly: true, maxAge: 5 * 60 * 1000, sameSite: 'strict'});
					res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict'});
					(req as AuthRequest).user = user;
					next();
				}
			});
		}

		if (!accessToken && refreshToken) {
			jwt.verify(refreshToken, JWT_SECRET, async (refreshError, refreshDecoded) => {
				if (refreshError) {
					return res.status(401).json({error: 'Invalid refresh token'});
				}

				const {iat, exp, ...decodedUser} = refreshDecoded as JwtPayload;
				const user = decodedUser as User;

				const existingUser = await queryDatabase(`
					SELECT username FROM zynqa_users
					WHERE username = $1
				`, [user.username]);

				if (!existingUser.rows[0]) {
					return res.status(401).json({error: 'No user present'});
				}

				const newAccessToken = await generateAccessToken(user);

				res.cookie('accessToken', newAccessToken, {httpOnly: true, maxAge: 5 * 60 * 1000, sameSite: 'strict'});
				res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict'});
				(req as AuthRequest).user = user;
				next();
			});
		}
	} catch (error) {
		if (error instanceof Error) {
			return res.status(401).json({error: error.message});
		}
	}
};
