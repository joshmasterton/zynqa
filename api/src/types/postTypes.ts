import {type Request} from 'express';

export type PostBody = {
	post: string;
	username: string;
	email: string;
	profile_picture_url: string;
};

export type Post = {
	post_id: number;
	post: string;
	username: string;
	email: string;
	profile_picture_url: string;
	post_picture: string | undefined;
	likes: number;
	dislikes: number;
	comments: number;
	created_at: Date;
};

export type LikeDislikeBody = {
	type: string;
	post_id: number;
	username: string;
};

export type HasLikedDislikedRequest = Request & {
	query: {
		post_id: number;
	};
};
