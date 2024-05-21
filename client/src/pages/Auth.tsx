import {type ChangeEvent, type FormEvent, useState} from 'react';
import {
	type ShowPasswords, type AuthDetails, type AuthProps, type User,
} from '../types/AuthTypes';
import {request} from '../requests/requests';
import {usePopup} from '../contexts/PopupContext';
import {Link} from 'react-router-dom';
import {LightMode} from '../contexts/LightModeContext';
import {FaLock, FaUser} from 'react-icons/fa';
import {BsEyeFill, BsEyeSlashFill} from 'react-icons/bs';
import {BiPlus} from 'react-icons/bi';
import './styles/Auth.scss';

export function Auth({isLogin}: AuthProps) {
	const {setPopup} = usePopup();
	const [showPassword, setShowPasswords] = useState<ShowPasswords>({
		password: false,
		confirmPassword: false,
	});
	const [authDetails, setAuthDetails] = useState<AuthDetails>({
		username: 'Zonomaly',
		password: 'Password',
		confirmPassword: 'Password',
		profilePicture: undefined,
	});

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (e?.target?.files?.[0]) {
			if (validImageTypes.includes(e.target.files[0].type)) {
				setAuthDetails(prevState => ({
					...prevState,
					profilePicture: e?.target?.files?.[0],
				}));
			} else {
				setPopup('Muse be a valid image type');
			}
		}
	};

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
				const login = await request<AuthDetails, User>('/login', 'POST', false, authDetails);
				console.log(login);
			} else if (!isLogin) {
				if (authDetails.confirmPassword && authDetails.profilePicture) {
					const formData = new FormData();
					formData.append('username', authDetails.username);
					formData.append('password', authDetails.password);
					formData.append('confirmPassword', authDetails.confirmPassword);
					formData.append('profilePicture', authDetails.profilePicture);

					const signup = await request<BodyInit, User>('/signup', 'POST', true, formData);
					console.log(signup);
				} else {
					setPopup('Choose a profile picture');
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				setPopup(error.message);
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
				{!isLogin && (
					<div>
						<div>Add profile picture</div>
						<label className='file' htmlFor='profilePicture' aria-label='Add Profile Picture'>
							<input type='file' id='profilePicture' onChange={e => {
								handleFileChange(e);
							}}/>
							<BiPlus/>
							{authDetails.profilePicture && (
								<img alt='' src={URL.createObjectURL(authDetails?.profilePicture)}/>
							)}
						</label>
					</div>
				)}
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
