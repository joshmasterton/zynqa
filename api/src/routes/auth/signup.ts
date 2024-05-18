import {type User, type AuthDetails} from '../../types/authTypes.ts';
import express from 'express';
import {hash} from 'bcryptjs';
import {check, validationResult} from 'express-validator';
import {queryDatabase} from '../../database/initializeDatabase.ts';
import {generateAccessToken, generateRefreshToken} from '../../token/generateToken.ts';

export const signup = express.Router();

signup.post(
	'/',
	check('username').isString().notEmpty().withMessage('Username is required'),
	check('password').isString().isLength({min: 6}).withMessage('Password must be at least 6 characters'),
	check('confirmPassword').isString().isLength({min: 6}).withMessage('Confirm Password must be at least 6 characters'),
	async (req, res) => {
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			const validatoinErrorMessage: string = validationErrors.array()[0].msg as string;
			return res.status(400).json({error: validatoinErrorMessage});
		}

		const {username, password, confirmPassword} = req.body as AuthDetails;

		if (password !== confirmPassword) {
			return res.status(400).json({error: 'Passwords need to match'});
		}

		try {
			const userFromDatabase = await queryDatabase(`
				SELECT * FROM zynqa_users
				WHERE username_lower_case = $1
			`, [username.toLowerCase()]);

			const hashedPassword = await hash(password, 10);

			if (userFromDatabase.rows[0]) {
				return res.status(400).json({error: 'User already exists'});
			}

			const newUser = await queryDatabase(`
				INSERT INTO zynqa_users(
					username, username_lower_case, password
				)VALUES(
					$1, $2, $3
				) RETURNING user_id, username, followers, following, friends,
					posts, likes, comments, created_at, last_online;
			`, [username, username.toLowerCase(), hashedPassword]);

			if (newUser.rows[0]) {
				const user: User = newUser.rows[0] as User;

				const accessToken = await generateAccessToken(user);
				const refreshToken = await generateRefreshToken(user);

				res.cookie('accessToken', accessToken, {httpOnly: true, maxAge: 3600000, sameSite: 'strict'});
				res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 3600000, sameSite: 'strict'});

				return res.json(user);
			}
		} catch (error) {
			if (error instanceof Error) {
				return res.status(500).json({error: error.message});
			}
		}
	},
);
