import {type ChangeEvent, type FormEvent, useState} from 'react';
import {
	type ShowPasswords, type AuthDetails, type AuthProps, type User,
} from '../types/AuthTypes';
import {request} from '../requests/requests';
import {Link} from 'react-router-dom';
import {LightMode} from '../contexts/LightModeContext';
import {FaLock, FaUser} from 'react-icons/fa';
import {BsEyeFill, BsEyeSlashFill} from 'react-icons/bs';
import './styles/Auth.scss';

export function Auth({isLogin}: AuthProps) {
	const [showPassword, setShowPasswords] = useState<ShowPasswords>({
		password: false,
		confirmPassword: false,
	});
	const [authDetails, setAuthDetails] = useState<AuthDetails>({
		username: 'Zonomaly',
		password: 'Password',
		confirmPassword: 'Password',
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;

		setAuthDetails(prevState => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			if (isLogin) {
				const login = await request<AuthDetails, User>('/login', 'POST', authDetails);
				console.log(login);
			} else {
				const signup = await request<AuthDetails, User>('/signup', 'POST', authDetails);
				console.log(signup);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	};

	const handleShowPassword = (password: keyof ShowPasswords) => {
		setShowPasswords(prevState => ({
			...prevState,
			[password]: !prevState[password],
		}));
	};

	return (
		<form id='auth' method='POST' onSubmit={async e => {
			await handleSubmit(e);
		}}>
			<header>
				<h1>{isLogin ? 'Login' : 'Signup'}</h1>
			</header>
			<main>
				<label htmlFor='username' className='authLabel'>
					<div>Username</div>
					<FaUser/>
					<input
						type='text'
						id='username'
						name='username'
						onChange={e => {
							handleInputChange(e);
						}}
						value={authDetails.username}
						placeholder='Username'
					/>
				</label>
				<div className='authLabel'>
					<label htmlFor='password'>
						<div>Password</div>
						<FaLock/>
						<input
							type={showPassword.password ? 'text' : 'password'}
							id='password'
							name='password'
							onChange={e => {
								handleInputChange(e);
							}}
							value={authDetails.password}
							placeholder='Password'
						/>
					</label>
					<button type='button' aria-label='Show Password' onClick={() => {
						handleShowPassword('password');
					}}>
						{showPassword.password ? <BsEyeSlashFill/> : <BsEyeFill/>}
					</button>
				</div>
				{isLogin ? null : (
					<div className='authLabel'>
						<label htmlFor='confirmPassword'>
							<div>Confirm Password</div>
							<FaLock/>
							<input
								type={showPassword.confirmPassword ? 'text' : 'password'}
								id='confirmPassword'
								name='confirmPassword'
								onChange={e => {
									handleInputChange(e);
								}}
								value={authDetails.confirmPassword}
								placeholder='Confirm Password'
							/>
						</label>
						<button type='button' aria-label='Show Confirm Password' onClick={() => {
							handleShowPassword('confirmPassword');
						}}>
							{showPassword.confirmPassword ? <BsEyeSlashFill/> : <BsEyeFill/>}
						</button>
					</div>
				)}
				<button type='submit'>
					{isLogin ? 'Login' : 'Signup'}
				</button>
			</main>
			<footer>
				<p>
					{isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
				</p>
				{isLogin
					? <Link to='/signup' className='link'>Signup</Link>
					: <Link to='/login' className='link'>Login</Link>
				}
			</footer>
			<LightMode/>
		</form>
	);
}
