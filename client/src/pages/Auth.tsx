import {type ChangeEvent, type FormEvent, useState} from 'react';
import {type ShowPasswords, type AuthDetails, type AuthProps} from '../types/AuthTypes';
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
		confirmPassword: '',
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;

		setAuthDetails(prevState => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isLogin) {
			console.log({username: authDetails.username, password: authDetails.password});
		} else {
			console.log(authDetails);
		}
	};

	const handleShowPassword = (password: keyof ShowPasswords) => {
		setShowPasswords(prevState => ({
			...prevState,
			[password]: !prevState[password],
		}));
	};

	return (
		<form id='auth' method='POST' onSubmit={e => {
			handleSubmit(e);
		}}>
			<header>
				<h1>{isLogin ? 'Login' : 'Signup'}</h1>
				<LightMode/>
			</header>
			<main>
				<label htmlFor='username' className='authLabel'>
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
		</form>
	);
}
