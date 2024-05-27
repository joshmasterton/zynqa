/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import {type Post, type LikeDislikeBody} from '../../types/postTypes';
import {check, validationResult} from 'express-validator';
import {customSanitizer} from '../../utilities/customSanitizer';
import {queryDatabase} from '../../database/initializeDatabase';
import {verifyToken} from '../../token/verifyToken';

export const likeDislike = express.Router();

likeDislike.post(
	'/',
	verifyToken,
	check('type').customSanitizer(customSanitizer).trim().isString().notEmpty(),
	check('post_id').customSanitizer(customSanitizer).trim().isInt().toInt(),
	check('username').customSanitizer(customSanitizer).trim().isString().notEmpty(),
	async (req, res) => {
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			const validatoinErrorMessage: string = validationErrors.array()[0].msg as string;
			return res.status(400).json({error: validatoinErrorMessage});
		}

		const {type, post_id, username} = req.body as LikeDislikeBody;

		try {
			const existingLikeDislike = await queryDatabase(`
				SELECT * FROM zynqa_likes_dislikes
				WHERE post_id = $1 AND username = $2
			`, [post_id, username]);

			if (existingLikeDislike.rows.length > 0) {
				const existingLikeDislikeType = existingLikeDislike.rows[0].type as string;

				if (existingLikeDislikeType === type) {
					await queryDatabase(`
						DELETE FROM zynqa_likes_dislikes
						WHERE post_id = $1 AND 
						username = $2
					`, [post_id, username]);

					await queryDatabase(`
						UPDATE zynqa_posts
						SET ${type}s = ${type}s - 1
						WHERE post_id = $1
					`, [post_id]);
				} else {
					await queryDatabase(`
						UPDATE zynqa_likes_dislikes
						SET type = $1
						WHERE post_id = $2 AND username = $3
					`, [type, post_id, username]);

					await queryDatabase(`
						UPDATE zynqa_posts
						SET ${type}s = ${type}s + 1
						WHERE post_id = $1
					`, [post_id]);

					await queryDatabase(`
						UPDATE zynqa_posts
						SET ${type === 'like' ? 'dislike' : 'like'}s = ${type === 'like' ? 'dislike' : 'like'}s - 1
						WHERE post_id = $1
					`, [post_id]);
				}

				const postFromDatabase = await queryDatabase(`
					SELECT * FROM zynqa_posts
					WHERE post_id = $1
				`, [post_id]);

				const updatedPost: Post = postFromDatabase.rows[0] as Post;
				return res.status(201).json(updatedPost);
			}

			await queryDatabase(`
				INSERT INTO zynqa_likes_dislikes(
					post_id,
					type,
					username
				)VALUES($1, $2, $3)
			`, [post_id, type, username]);

			await queryDatabase(`
				UPDATE zynqa_posts
				SET ${type}s = ${type}s + 1
				WHERE post_id = $1
			`, [post_id]);

			const postFromDatabase = await queryDatabase(`
				SELECT * FROM zynqa_posts
				WHERE post_id = $1
			`, [post_id]);

			const updatedPost: Post = postFromDatabase.rows[0] as Post;
			return res.status(201).json(updatedPost);
		} catch (error) {
			if (error instanceof Error) {
				return res.status(500).json({error: error.message});
			}
		}
	},
);
