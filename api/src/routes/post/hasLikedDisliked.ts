/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import {query, validationResult} from 'express-validator';
import {customSanitizer} from '../../utilities/customSanitizer';
import {queryDatabase} from '../../database/initializeDatabase';
import {verifyToken} from '../../token/verifyToken';
import {type AuthRequest} from '../../types/authTypes';
import {type HasLikedDislikedRequest} from '../../types/postTypes';

export const hasLikedDisliked = express.Router();

hasLikedDisliked.get(
	'/',
	verifyToken,
	query('post_id').customSanitizer(customSanitizer).trim().toInt(),
	async (req: HasLikedDislikedRequest, res) => {
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			const validatoinErrorMessage: string = validationErrors.array()[0].msg as string;
			return res.status(400).json({error: validatoinErrorMessage});
		}

		const {post_id} = req.query;
		const {user} = (req as HasLikedDislikedRequest & AuthRequest);

		if (!user) {
			return res.status(401).json({error: 'No user'});
		}

		try {
			const existingPostLikeDislike = await queryDatabase(`
				SELECT * FROM zynqa_likes_dislikes
				WHERE post_id = $1 AND username = $2
			`, [post_id, user.username]);

			if (existingPostLikeDislike.rows.length > 0) {
				const existingPostLikeDislikeType: string = existingPostLikeDislike.rows[0].type as string;
				return res.status(201).json({type: existingPostLikeDislikeType});
			}

			return res.status(201).json({message: 'User has not interacted with post'});
		} catch (error) {
			if (error instanceof Error) {
				return res.status(500).json({error: error.message});
			}
		}
	},
);
