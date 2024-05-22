import request from 'supertest';
import express from 'express';
import {login} from '../../routes/auth/login';

const app = express();
app.use(express.json());
app.use('/login', login);

describe('POST /login', () => {
	it('should return 400 with invalid credentials', async () => {
		const response = await request(app)
			.post('/login')
			.send({username: 'testUser', password: 'wrongPassword'});
		expect(response.status).toBe(400);
		expect(response.body.error).toBe('Invalid user details');
	});
});
