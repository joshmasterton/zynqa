import {type TokenResult} from '../types/authTypes';
import crypto from 'crypto';
import {queryDatabase} from '../database/initializeDatabase';
import {hash} from 'bcryptjs';

export const generateResetPasswordToken = async (email: string): Promise<string> => new Promise((resolve, reject) => {
	crypto.randomBytes(20, async (error, buffer) => {
		if (error) {
			reject(error);
			return;
		}

		const token = buffer.toString('hex');
		const tokenExpiration = new Date(Date.now() + (15 * 60 * 1000)).toISOString();
		const hashedToken = await hash(token, 10);

		try {
			const isTokenReset = await queryDatabase(`
				SELECT expiration_timestamp, token FROM zynqa_reset_password_tokens
				WHERE email = $1
			`, [email]);

			const tokenResult: TokenResult[] = isTokenReset.rows as TokenResult[];

			if (tokenResult[0]) {
				await queryDatabase(`
					DELETE FROM zynqa_reset_password_tokens
					WHERE email = $1
				`, [email]);
			}

			// Insert the token into the database
			await queryDatabase(`
				INSERT INTO zynqa_reset_password_tokens(
					token, email, expiration_timestamp
				) VALUES (
					$1, $2, $3
				)
			`, [hashedToken, email, tokenExpiration]);

			// Resolve the promise with the token
			resolve(token);
		} catch (error) {
			if (error instanceof Error) {
				reject(error);
			}
		}
	});
});
