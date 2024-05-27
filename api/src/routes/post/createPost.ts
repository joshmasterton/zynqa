/* eslint-disable @typescript-eslint/naming-convention */
import {type PostBody} from '../../types/postTypes';
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import dotenv from 'dotenv';
import aws from 'aws-sdk';
import {verifyToken} from '../../token/verifyToken';
import {check, validationResult} from 'express-validator';
import {limiter} from '../../utilities/rateLimiter';
import {queryDatabase} from '../../database/initializeDatabase';
import {customSanitizer} from '../../utilities/customSanitizer';
dotenv.config({path: 'src/.env'});

export const createPost = express.Router();

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

createPost.post(
	'/',
	limiter,
	verifyToken,
	upload.single('postFile'),
	check('post').customSanitizer(customSanitizer).trim().isString().notEmpty().withMessage('Post cannot be empty'),
	check('profile_picture_url').customSanitizer(customSanitizer).trim().isString().notEmpty().withMessage('Profile picture cannot be empty'),
	check('username').customSanitizer(customSanitizer).trim().isString().notEmpty().withMessage('Post cannot be empty'),
	check('email').customSanitizer(customSanitizer).trim().isEmail().withMessage('Muse be valid email type').notEmpty().withMessage('Muse be valid email type'),
	async (req, res) => {
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			const validatoinErrorMessage: string = validationErrors.array()[0].msg as string;
			return res.status(400).json({error: validatoinErrorMessage});
		}

		const {post, username, email, profile_picture_url} = req.body as PostBody;
		const {file} = req;

		try {
			if (file) {
				if (!file?.originalname || !file.buffer) {
					return res.status(400).json({error: 'Invalid file data'});
				}

				const processedFile = await sharp(file.buffer)
					.resize({
						width: 1000,
						withoutEnlargement: true,
					})
					.toFormat('jpeg')
					.jpeg({quality: 75, progressive: true})
					.toBuffer();

				const timestamp = Date.now();
				const fileExtension = '.jpeg';
				const key = `${file.originalname}-${timestamp}${fileExtension}`;

				const data = await s3.upload({
					Bucket: 'zynqa',
					Key: key,
					Body: processedFile,
					ACL: 'public-read',
				}).promise();

				await queryDatabase(`
					INSERT INTO zynqa_posts(
						post,
						username,
						email,
						profile_picture_url,
						post_picture
					)VALUES(
						$1, $2, $3, $4, $5
					)
				`, [post, username, email, profile_picture_url, data?.Location]);
			} else {
				await queryDatabase(`
					INSERT INTO zynqa_posts(
						post,
						username,
						email,
						profile_picture_url
					)VALUES(
						$1, $2, $3, $4
					)
				`, [post, username, email, profile_picture_url]);
			}

			return res.status(201).json({message: 'Post uploaded'});
		} catch (error) {
			if (error instanceof Error) {
				return res.status(500).json({error: error.message});
			}
		}
	},
);
