/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {createUsersTable} from './database/createTables.ts';
import {signup} from './routes/auth/signup.ts';
import {login} from './routes/auth/login.ts';
import {getUser} from './routes/user/getUser.ts';
dotenv.config({path: 'src/.env'});

const app = express();
const {CLIENT_URL, PORT} = process.env;

// Security and parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(cors({
	credentials: true,
	origin: CLIENT_URL,
}));

// Database tables
createUsersTable()
	.catch(error => {
		if (error instanceof Error) {
			throw error;
		}
	});

// Routes
app.use('/signup', signup);
app.use('/login', login);
app.use('/getUser', getUser);

app.listen(PORT, () => {
	console.log(`Listening to server on port ${PORT}`);
});
