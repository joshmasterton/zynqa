import express from 'express';
import {type AuthRequest} from '../../types/authTypes';
import {verifyToken} from '../../token/verifyToken';

export const getUser = express.Router();

getUser.get('/', verifyToken, (req, res) => {
	const {user} = (req as AuthRequest);

	if (!user) {
		return res.status(401).json({error: 'No user'});
	}

	return res.status(201).json(user);
});
