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
				password VARCHAR(60),
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
