/* eslint-disable @typescript-eslint/naming-convention */
import pg, {type QueryResult} from 'pg';
import dotenv from 'dotenv';
dotenv.config({path: 'src/.env'});

const {Pool} = pg;
const {DATABASE_URL} = process.env;

if (!DATABASE_URL) {
	throw new Error('No DATABASE_URL to connect to');
}

const pool = new Pool({
	connectionString: DATABASE_URL,
});

export const queryDatabase = async <T>(text: string, params?: T[]): Promise<QueryResult> => {
	try {
		const result = await pool.query(text, params);
		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
