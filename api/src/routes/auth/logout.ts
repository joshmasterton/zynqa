import express from 'express';
import {verifyToken} from '../../token/verifyToken';

export const logout = express.Router();

logout.get('/', verifyToken, (_req, res) => {
	res.clearCookie('accessToken', {httpOnly: true, sameSite: 'strict'});
	res.clearCookie('refreshToken', {httpOnly: true, sameSite: 'strict'});

	res.status(200).json({message: 'Successfully logged out'});
});
