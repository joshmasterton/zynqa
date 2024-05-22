import {type TokenResult, type NewDetails} from '../../types/authTypes';
import express from 'express';
import {check, validationResult} from 'express-validator';
import {queryDatabase} from '../../database/initializeDatabase';
import {compare, hash} from 'bcryptjs';
import {limiter} from '../../utilities/rateLimiter';

export const resetPassword = express.Router();

resetPassword.post(
	'/',
	limiter,
	check('email').isEmail().withMessage('Muse be valid email type').notEmpty().withMessage('Must be valid email type'),
	check('token').isString().notEmpty().withMessage('Token cannot be empty'),
	check('newPassword').isString().isLength({min: 6}).withMessage('New password must be at least 6 characters'),
	check('confirmNewPassword').isString().isLength({min: 6}).withMessage('Confirm new password must be at least 6 characters'),
	async (req, res) => {
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			const validatoinErrorMessage: string = validationErrors.array()[0].msg as string;
			return res.status(400).json({error: validatoinErrorMessage});
		}

		const {email, token, newPassword, confirmNewPassword} = req.body as NewDetails;

		if (newPassword !== confirmNewPassword) {
			return res.status(400).json({error: 'Passwords must match'});
		}

		try {
			const existingUser = await queryDatabase(`
				SELECT email FROM zynqa_users
				WHERE email = $1
			`, [email]);

			if (!existingUser.rows[0]) {
				return res.status(400).json({error: 'No account associated with this email'});
			}

			const resetPassword = await queryDatabase(`
				SELECT expiration_timestamp, token FROM zynqa_reset_password_tokens
				WHERE email = $1
			`, [email]);

			const tokenResult: TokenResult[] = resetPassword.rows as TokenResult[];

			if (!tokenResult[0]) {
				return res.status(401).json({error: 'Invalid or expired token'});
			}

			const expirationTimestamp = new Date(tokenResult[0].expiration_timestamp).getTime();
			if (expirationTimestamp < Date.now()) {
				return res.status(401).json({error: 'Token has expired'});
			}

			const isTokenValid = await compare(token, tokenResult[0].token);
			if (!isTokenValid) {
				return res.status(401).json({error: 'Invalid or expired token'});
			}

			const hashedPassword = await hash(newPassword, 10);

			await queryDatabase(`
				UPDATE zynqa_users
				SET password = $1
				WHERE email = $2
			`, [hashedPassword, email]);

			await queryDatabase(`
				DELETE FROM zynqa_reset_password_tokens
				WHERE email = $1
			`, [email]);

			return res.status(201).json({message: 'Reset password'});
		} catch (error) {
			if (error instanceof Error) {
				return res.status(400).json({error: error.message});
			}
		}
	},
);
