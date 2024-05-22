/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import {check, validationResult} from 'express-validator';
import {type ForgotPasswordRequest} from '../../types/authTypes';
import {queryDatabase} from '../../database/initializeDatabase';
import {generateResetPasswordToken} from '../../token/generatePasswordToken';
import nodemailer from 'nodemailer';
import {limiter} from '../../utilities/rateLimiter';

export const forgotPassword = express.Router();
const {MAILGUN_SMTP_LOGIN, MAILGUN_SMTP_PASSWORD} = process.env;

const transporter = nodemailer.createTransport({
	host: 'smtp.mailgun.org',
	port: 587,
	auth: {
		user: MAILGUN_SMTP_LOGIN,
		pass: MAILGUN_SMTP_PASSWORD,
	},
});

forgotPassword.post(
	'/',
	limiter,
	check('email').isEmail().withMessage('Muse be valid email type').notEmpty().withMessage('Must be valid email type'),
	async (req, res) => {
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			const validatoinErrorMessage: string = validationErrors.array()[0].msg as string;
			return res.status(400).json({error: validatoinErrorMessage});
		}

		const {email} = req.body as ForgotPasswordRequest;

		try {
			const existingUser = await queryDatabase(`
				SELECT email FROM zynqa_users
				WHERE email = $1
			`, [email]);

			if (!existingUser.rows[0]) {
				return res.status(400).json({error: 'No account associated with this email'});
			}

			const token = await generateResetPasswordToken(email);

			await transporter.sendMail({
				from: 'no-reploy@zynqa.com',
				to: email,
				subject: 'Password Reset',
				text: `You requested a password reset, use this token to reset your password on the reset password page: ${token}`,
			});

			return res.status(201).json({message: 'Email sent'});
		} catch (error) {
			if (error instanceof Error) {
				return res.status(400).json({error: error.message});
			}
		}
	},
);
