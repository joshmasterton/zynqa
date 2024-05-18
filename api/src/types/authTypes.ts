export type AuthDetails = {
	username: string;
	password: string;
	confirmPassword?: string;
};

export type User = {
	user_id: number;
	username: string;
	followers: number;
	following: number;
	friends: number;
	posts: number;
	likes: number;
	comments: number;
	created_at: Date;
	last_online: Date;
};
