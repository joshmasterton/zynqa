import {type Request} from 'express';

export type AuthDetails = {
	username: string;
	email: string;
	password: string;
	confirmPassword?: string;
	profilePicture?: File;
};

export type NewDetails = {
	email: string;
	token: string;
	newPassword: string;
	confirmNewPassword: string;
};

export type TokenResult = {
	expiration_timestamp: string;
};

export type ForgotPasswordRequest = {
	email: string;
};

export type User = {
	user_id: number;
	username: string;
	email: string;
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
