import {type User, type AuthDetails} from '../../types/authTypes.ts';
import express from 'express';
import {compare} from 'bcryptjs';
import {check, validationResult} from 'express-validator';
import {queryDatabase} from '../../database/initializeDatabase.ts';
import {generateAccessToken, generateRefreshToken} from '../../token/generateToken.ts';
import {limiter} from '../../utilities/rateLimiter.ts';
import {customSanitizer} from '../../utilities/customSanitizer.ts';

export const login = express.Router();

login.post(
	'/',
	limiter,
	check('username').customSanitizer(customSanitizer).trim().isString().notEmpty().withMessage('Username is required'),
	check('password').customSanitizer(customSanitizer).trim().isString().isLength({min: 6}).withMessage('Password must be at least 6 characters'),
	async (req, res) => {
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			const validatoinErrorMessage: string = validationErrors.array()[0].msg as string;
			return res.status(400).json({error: validatoinErrorMessage});
		}

		const {username, password} = req.body as AuthDetails;

		try {
			const existingUser = await queryDatabase(`
				SELECT password FROM zynqa_users
				WHERE username = $1
			`, [username]);

			if (!existingUser.rows[0]) {
				return res.status(400).json({error: 'Invalid user details'});
			}

			const existingUserPassword: string = existingUser.rows[0].password as string;
			const comparePassword = await compare(password, existingUserPassword);

			if (!comparePassword) {
				return res.status(400).json({error: 'Invalid user details'});
			}

			const userFromDatabase = await queryDatabase(`
				SELECT user_id, username, email, followers, following, friends, profile_picture_url,
				posts, likes, comments, created_at, last_online FROM zynqa_users
				WHERE username = $1
			`, [username]);

			const user: User = userFromDatabase.rows[0] as User;

			const accessToken = await generateAccessToken(user);
			const refreshToken = await generateRefreshToken(user);

			res.cookie('accessToken', accessToken, {httpOnly: true, maxAge: 5 * 60 * 1000, sameSite: 'strict'});
			res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict'});

			return res.status(201).json(user);
		} catch (error) {
			if (error instanceof Error) {
				return res.status(500).json({error: error.message});
			}
		}
	},
);
