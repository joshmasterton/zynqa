export type AuthProps = {
	isLogin: boolean;
};

export type AuthDetails = {
	username: string;
	password: string;
	confirmPassword?: string;
};

export type ShowPasswords = {
	password: boolean;
	confirmPassword: boolean;
};
