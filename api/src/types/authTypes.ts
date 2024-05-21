import {type Request} from 'express';

export type AuthDetails = {
	username: string;
	password: string;
	confirmPassword?: string;
	profilePicture?: File;
};

export type User = {
	user_id: number;
	username: string;
	followers: number;
	following: number;
	friends: number;
	profile_picture_url: string;
	posts: number;
	likes: number;
	comments: number;
	created_at: Date;
	last_online: Date;
};

export type AuthRequest = Request & {
	user: User;
};

export type JwtPayload = {
	iat: number;
	exp: number;
};
