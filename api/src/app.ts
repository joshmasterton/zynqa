/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {createResetPasswordTable, createUsersTable} from './database/createTables.ts';
import {signup} from './routes/auth/signup.ts';
import {login} from './routes/auth/login.ts';
import {logout} from './routes/auth/logout.ts';
import {getUser} from './routes/user/getUser.ts';
import {forgotPassword} from './routes/auth/forgotPassword.ts';
import {resetPassword} from './routes/auth/resetPassword.ts';
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
	.then(() => {
		createResetPasswordTable()
			.catch(error => {
				if (error instanceof Error) {
					throw error;
				}
			});
	})
	.catch(error => {
		if (error instanceof Error) {
			throw error;
		}
	});

// Routes
app.use('/signup', signup);
app.use('/login', login);
app.use('/getUser', getUser);
app.use('/logout', logout);
app.use('/forgotPassword', forgotPassword);
app.use('/resetPassword', resetPassword);

app.listen(PORT, () => {
	console.log(`Listening to server on port ${PORT}`);
});
