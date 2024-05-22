import crypto from 'crypto';
import {queryDatabase} from '../database/initializeDatabase';

export const generateResetPasswordToken = async (email: string): Promise<string> => new Promise((resolve, reject) => {
	crypto.randomBytes(20, async (error, buffer) => {
		if (error) {
			reject(error);
			return;
		}

		const token = buffer.toString('hex');
		const tokenExpiration = new Date(Date.now() + (15 * 60 * 1000)).toISOString();

		try {
			// Insert the token into the database
			await queryDatabase(`
          INSERT INTO zynqa_reset_password_tokens(
            token, email, expiration_timestamp
          ) VALUES (
            $1, $2, $3
          )
        `, [token, email, tokenExpiration]);

			// Resolve the promise with the token
			resolve(token);
		} catch (error) {
			if (error instanceof Error) {
				reject(error);
			}
		}
	});
});
