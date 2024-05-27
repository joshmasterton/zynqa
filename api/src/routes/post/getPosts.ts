import express from 'express';
import {queryDatabase} from '../../database/initializeDatabase';
import {type Post} from '../../types/postTypes.ts';

export const getPosts = express.Router();

getPosts.get('/', async (_req, res) => {
	try {
		const postsFromDatabase = await queryDatabase(`
			SELECT * FROM zynqa_posts
			ORDER BY created_at DESC;
		`);

		const posts: Post[] = postsFromDatabase.rows as Post[];

		return res.status(201).json(posts);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({error: error.message});
		}
	}
});
