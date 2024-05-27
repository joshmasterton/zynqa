import {queryDatabase} from './initializeDatabase.ts';

export const dropUsersTable = async () => {
	try {
		await queryDatabase('DROP TABLE IF EXISTS zynqa_users');
		console.log('Users table successfully dropped');
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}

		throw error;
	}
};

export const createUsersTable = async () => {
	try {
		await queryDatabase(`
			CREATE TABLE IF NOT EXISTS zynqa_users(
				user_id SERIAL PRIMARY KEY,
				username VARCHAR(60),
				username_lower_case VARCHAR(60),
				email VARCHAR(255),
				password VARCHAR(255),
				profile_picture_url VARCHAR(255),
				followers INT DEFAULT 0,
				following INT DEFAULT 0,
				friends INT DEFAULT 0,
				posts INT DEFAULT 0,
				likes INT DEFAULT 0,
				comments INT DEFAULT 0,
				created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
				last_online TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
			);
		`);
		console.log('Users table successfully created');
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}

		throw error;
	}
};

export const dropResetPasswordTable = async () => {
	try {
		await queryDatabase('DROP TABLE IF EXISTS zynqa_reset_password_tokens');
		console.log('Reset password table successfully dropped');
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}

		throw error;
	}
};

export const createResetPasswordTable = async () => {
	try {
		await queryDatabase(`
			CREATE TABLE IF NOT EXISTS zynqa_reset_password_tokens(
				reset_password_id SERIAL PRIMARY KEY,
				token VARCHAR(255),
				email VARCHAR(255),
				expiration_timestamp TIMESTAMPTZ NOT NULL
			);
		`);
		console.log('Reset password table successfully created');
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}

		throw error;
	}
};

export const dropPostsTable = async () => {
	try {
		await queryDatabase('DROP TABLE IF EXISTS zynqa_posts');
		console.log('Posts table successfully dropped');
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}

		throw error;
	}
};

export const createPostsTable = async () => {
	try {
		await queryDatabase(`
			CREATE TABLE IF NOT EXISTS zynqa_posts(
				post_id SERIAL PRIMARY KEY,
				post VARCHAR(500),
				username VARCHAR(60),
				email VARCHAR(60),
				profile_picture_url VARCHAR(255),
				post_picture VARCHAR(255) NULL,
				likes INT DEFAULT 0,
				dislikes INT DEFAULT 0,
				comments INT DEFAULT 0,
				created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
			);
		`);
		console.log('Posts table successfully created');
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}

		throw error;
	}
};

export const dropLikeDislikeTable = async () => {
	try {
		await queryDatabase('DROP TABLE IF EXISTS zynqa_likes_dislikes');
		console.log('Likes Dislike table successfully dropped');
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}

		throw error;
	}
};

export const createLikeDislikeTable = async () => {
	try {
		await queryDatabase(`
			CREATE TABLE IF NOT EXISTS zynqa_likes_dislikes(
				like_dislike_id SERIAL PRIMARY KEY,
				type VARCHAR(60),
				post_id INT NOT NULL,
				username VARCHAR(60)
			);
		`);
		console.log('Likes Dislike table successfully created');
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);

			throw error;
		}
	}
};
