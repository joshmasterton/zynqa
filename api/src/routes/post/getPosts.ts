import {type Post} from '../../types/postTypes.ts';
import express from 'express';
import {query, validationResult} from 'express-validator';
import {queryDatabase} from '../../database/initializeDatabase';
import {customSanitizer} from '../../utilities/customSanitizer.ts';
import {verifyToken} from '../../token/verifyToken.ts';

export const getPosts = express.Router();

getPosts.get(
	'/',
	verifyToken,
	query('page').customSanitizer(customSanitizer).trim().isInt().withMessage('Must be a non-negative integer').toInt(),
	async (req, res) => {
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			const validatoinErrorMessage: string = validationErrors.array()[0].msg as string;
			return res.status(400).json({error: validatoinErrorMessage});
		}

		const limit = 2;
		const page = parseInt(req?.query?.page as string, 10) || 0;
		const offset = page * limit;

		try {
			const postsFromDatabase = await queryDatabase(`
				SELECT * FROM zynqa_posts
				ORDER BY created_at DESC
				LIMIT $1 OFFSET $2
			`, [limit, offset]);

			const posts: Post[] = postsFromDatabase.rows as Post[];

			return res.status(201).json(posts);
		} catch (error) {
			if (error instanceof Error) {
				return res.status(500).json({error: error.message});
			}
		}
	},
);
