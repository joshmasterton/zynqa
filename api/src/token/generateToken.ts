
/* eslint-disable @typescript-eslint/naming-convention */
import {type User} from '../types/authTypes';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({path: 'src/.env'});

const {JWT_SECRET} = process.env;

export const generateAccessToken = async (user: User) => {
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined');
	}

	return jwt.sign(user, JWT_SECRET, {expiresIn: '5m'});
};

export const generateRefreshToken = async (user: User) => {
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined');
	}

	return jwt.sign(user, JWT_SECRET, {expiresIn: '7d'});
};
