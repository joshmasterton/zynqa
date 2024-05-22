/* eslint-disable @typescript-eslint/naming-convention */
import {type User, type AuthDetails} from '../../types/authTypes.ts';
import express from 'express';
import multer from 'multer';
import aws from 'aws-sdk';
import dotenv from 'dotenv';
import {hash} from 'bcryptjs';
import {check, validationResult} from 'express-validator';
import {queryDatabase} from '../../database/initializeDatabase.ts';
import {generateAccessToken, generateRefreshToken} from '../../token/generateToken.ts';
import sharp from 'sharp';
import {limiter} from '../../utilities/rateLimiter.ts';
dotenv.config({path: 'src/.env'});

export const signup = express.Router();
const {AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_SECRET, AWS_REGION} = process.env;
const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: {fileSize: 5 * 1024 * 1024},
	fileFilter(_req, file, cb) {
		const filetypes = /jpeg|jpg|gif|png/;
		const mimetype = filetypes.test(file.mimetype);
		const extname = filetypes.test(file.originalname.toLowerCase());

		if (mimetype && extname) {
			cb(null, true);
		} else {
			cb(new Error('Invalid file type. Only JPEG, PNG and GIF files are allowed.'));
		}
	},
});

aws.config.update({
	accessKeyId: AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_ACCESS_KEY_SECRET,
	region: AWS_REGION,
});

const s3 = new aws.S3();

signup.post(
	'/',
	limiter,
	upload.single('profilePicture'),
	check('username').isString().notEmpty().withMessage('Username is required'),
	check('email').isEmail().withMessage('Muse be valid email type').notEmpty().withMessage('Muse be valid email type'),
	check('password').isString().isLength({min: 6}).withMessage('Password must be at least 6 characters'),
	check('confirmPassword').isString().isLength({min: 6}).withMessage('Confirm password must be at least 6 characters'),
	async (req, res) => {
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			const validatoinErrorMessage: string = validationErrors.array()[0].msg as string;
			return res.status(400).json({error: validatoinErrorMessage});
		}

		const {username, email, password, confirmPassword} = req.body as AuthDetails;

		if (password !== confirmPassword) {
			return res.status(400).json({error: 'Passwords need to match'});
		}

		try {
			const userFromDatabase = await queryDatabase(`
				SELECT * FROM zynqa_users
				WHERE username_lower_case = $1
			`, [username.toLowerCase()]);

			const hashedPassword = await hash(password, 10);

			if (userFromDatabase.rows[0]) {
				return res.status(400).json({error: 'User already exists'});
			}

			const {file} = req;

			if (!file?.originalname || !file.buffer) {
				return res.status(400).json({error: 'Invalid file data'});
			}

			const processedFile = await sharp(file.buffer)
				.resize(500, 500)
				.toFormat('jpeg')
				.jpeg({quality: 35})
				.toBuffer();

			const timestamp = Date.now();
			const fileExtension = '.png';
			const key = `${file.originalname}-${timestamp}${fileExtension}`;

			const data = await s3.upload({
				Bucket: 'zynqa',
				Key: key,
				Body: processedFile,
				ACL: 'public-read',
			}).promise();

			const newUser = await queryDatabase(`
				INSERT INTO zynqa_users(
					username, username_lower_case, email, password, profile_picture_url
				)VALUES(
					$1, $2, $3, $4, $5
				) RETURNING user_id, username, email, profile_picture_url, followers, following, friends,
					posts, likes, comments, created_at, last_online;
			`, [username, username.toLowerCase(), email, hashedPassword, data.Location]);

			if (newUser.rows[0]) {
				const user: User = newUser.rows[0] as User;

				const accessToken = await generateAccessToken(user);
				const refreshToken = await generateRefreshToken(user);

				res.cookie('accessToken', accessToken, {httpOnly: true, maxAge: 3600000, sameSite: 'strict'});
				res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 3600000, sameSite: 'strict'});

				return res.json(user);
			}
		} catch (error) {
			if (error instanceof Error) {
				return res.status(500).json({error: error.message});
			}
		}
	},
);
