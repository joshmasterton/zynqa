import {type User} from '../../types/authTypes';
import express from 'express';
import {query, validationResult} from 'express-validator';
import {customSanitizer} from '../../utilities/customSanitizer';
import {verifyToken} from '../../token/verifyToken';
import {queryDatabase} from '../../database/initializeDatabase';

export const getProfile = express.Router();

getProfile.get(
	'/',
	verifyToken,
	query('username').customSanitizer(customSanitizer).trim().isString().notEmpty(),
	async (req, res) => {
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			const validatoinErrorMessage: string = validationErrors.array()[0].msg as string;
			return res.status(400).json({error: validatoinErrorMessage});
		}

		const {username} = req.query;

		try {
			const userFromDatabase = await queryDatabase(`
				SELECT user_id, username, email, followers, following, friends, profile_picture_url,
				posts, likes, dislikes, comments, created_at, last_online FROM zynqa_users
				WHERE username = $1
			`, [username]);

			if (userFromDatabase.rows.length > 0) {
				const user = userFromDatabase.rows[0] as User;

				return res.status(201).json(user);
			}

			throw new Error('No user found');
		} catch (error) {
			if (error instanceof Error) {
				return res.status(500).json({error: error.message});
			}
		}
	},
);
