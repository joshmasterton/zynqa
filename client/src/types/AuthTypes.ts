export type AuthProps = {
	isLogin: boolean;
};

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

export type ShowPasswords = {
	password: boolean;
	confirmPassword: boolean;
};

export type ShowNewPasswords = {
	newPassword: boolean;
	confirmNewPassword: boolean;
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
