/* eslint-disable @typescript-eslint/naming-convention */
import {type User} from '../../types/authTypes';
import express, {type Request} from 'express';
import multer from 'multer';
import aws from 'aws-sdk';
import {limiter} from '../../utilities/rateLimiter';
import {verifyToken} from '../../token/verifyToken';
import dotenv from 'dotenv';
import sharp from 'sharp';
import {queryDatabase} from '../../database/initializeDatabase';
import {generateAccessToken, generateRefreshToken} from '../../token/generateToken';
dotenv.config();

export const updateProfile = express.Router();

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

updateProfile.post(
	'/',
	limiter,
	verifyToken,
	upload.single('profilePicture'),
	async (req: Request & {user?: User}, res) => {
		try {
			const {file} = req;
			const {user} = req;

			const oldProfilePictureKey = user?.profile_picture_url.split('/').pop();

			console.log(oldProfilePictureKey);

			if (oldProfilePictureKey) {
				try {
					await s3.deleteObject({
						Bucket: 'zynqa',
						Key: oldProfilePictureKey,
					}).promise();
				} catch (error) {
					console.error(error);
				}
			}

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

			await queryDatabase(`
				UPDATE zynqa_users
				SET profile_picture_url = $1
				WHERE user_id = $2
			`, [data.Location, user?.user_id]);

			const updatedUserFromDatabase = await queryDatabase(`
				SELECT user_id, username, email, followers, following, friends, profile_picture_url,
				posts, likes, comments, created_at, last_online FROM zynqa_users
				WHERE username = $1
			`, [user?.username]);

			if (!updatedUserFromDatabase.rows[0]) {
				return res.status(401).json({error: 'No user present'});
			}

			const updatedUser: User = updatedUserFromDatabase.rows[0] as User;

			const accessToken = await generateAccessToken(updatedUser);
			const refreshToken = await generateRefreshToken(updatedUser);

			res.cookie('accessToken', accessToken, {httpOnly: true, maxAge: 3600000, sameSite: 'strict'});
			res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 3600000, sameSite: 'strict'});
			req.user = updatedUser;

			return res.status(201).json({message: 'Successfully updated profile picture'});
		} catch (error) {
			if (error instanceof Error) {
				if (error instanceof Error) {
					return res.status(500).json({error: error.message});
				}
			}
		}
	},
);
