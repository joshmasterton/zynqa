/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {
	createLikeDislikeTable, createPostsTable, createResetPasswordTable, createUsersTable,
} from './database/createTables.ts';
import {signup} from './routes/auth/signup.ts';
import {login} from './routes/auth/login.ts';
import {logout} from './routes/auth/logout.ts';
import {getUser} from './routes/user/getUser.ts';
import {forgotPassword} from './routes/auth/forgotPassword.ts';
import {resetPassword} from './routes/auth/resetPassword.ts';
import {updateProfilePicture} from './routes/user/updateProfilePicture.ts';
import {createPost} from './routes/post/createPost.ts';
import {getPosts} from './routes/post/getPosts.ts';
import {likeDislike} from './routes/post/likeDislike.ts';
import {hasLikedDisliked} from './routes/post/hasLikedDisliked.ts';
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

createPostsTable()
	.catch(error => {
		if (error instanceof Error) {
			throw error;
		}
	});

createLikeDislikeTable()
	.catch(error => {
		if (error instanceof Error) {
			throw error;
		}
	});

// Auth routes
app.use('/signup', signup);
app.use('/login', login);
app.use('/getUser', getUser);
app.use('/logout', logout);
app.use('/forgotPassword', forgotPassword);
app.use('/resetPassword', resetPassword);
app.use('/updateProfilePicture', updateProfilePicture);

// Post routes
app.use('/createPost', createPost);
app.use('/getPosts', getPosts);
app.use('/likeDislike', likeDislike);
app.use('/hasLikedDisliked', hasLikedDisliked);

app.listen(PORT, () => {
	console.log(`Listening to server on port ${PORT}`);
});
