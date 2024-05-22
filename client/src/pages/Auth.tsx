import {
	type ChangeEvent, type FormEvent, useState,
} from 'react';
import {
	type ShowPasswords, type AuthDetails, type AuthProps, type User,
} from '../types/AuthTypes';
import {request} from '../requests/requests';
import {useUser} from '../contexts/UserContext';
import {usePopup} from '../contexts/PopupContext';
import {Link} from 'react-router-dom';
import {Loading} from '../comps/Loading';
import {LightMode, useLightMode} from '../contexts/LightModeContext';
import {FaLock, FaUser} from 'react-icons/fa';
import {BsEyeFill, BsEyeSlashFill} from 'react-icons/bs';
import {BiPlus} from 'react-icons/bi';
import logoLight from '../styles/zynqa_logo_light.png';
import logoDark from '../styles/zynqa_logo_dark.png';
import './styles/Auth.scss';

export function Auth({isLogin}: AuthProps) {
	const {user, setUser} = useUser();
	const {lightMode} = useLightMode();
	const [loading, setLoading] = useState<boolean>(false);
	const {setPopup} = usePopup();
	const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
		password: false,
		confirmPassword: false,
	});
	const [authDetails, setAuthDetails] = useState<AuthDetails>({
		username: 'Zonomaly',
		email: 'joshmasterton@tuta.io',
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

		if (loading) {
			return;
		}

		try {
			setLoading(true);
			if (isLogin) {
				const loginUser = await request<AuthDetails, User>('/login', 'POST', false, authDetails);
				if (loginUser) {
					setUser(loginUser);
				}
			} else if (!isLogin) {
				if (authDetails.confirmPassword && authDetails.profilePicture) {
					const formData = new FormData();
					formData.append('username', authDetails.username);
					formData.append('email', authDetails.email);
					formData.append('password', authDetails.password);
					formData.append('confirmPassword', authDetails.confirmPassword);
					formData.append('profilePicture', authDetails.profilePicture);

					const signupUser = await request<BodyInit, User>('/signup', 'POST', true, formData);
					if (signupUser) {
						setUser(signupUser);
					}
				} else {
					setPopup('Choose a profile picture');
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				setPopup(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleShowPassword = (password: keyof ShowPasswords) => {
		setShowPasswords(prevState => ({
			...prevState,
			[password]: !prevState[password],
		}));
	};

	if (!user) {
		return (
			<form id='auth' method='POST' onSubmit={async e => {
				await handleSubmit(e);
			}} noValidate>
				<img alt='Logo' src={lightMode === 'dark' ? logoLight : logoDark} className='logo'/>
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
					{isLogin ? null : (
						<label htmlFor='email' className='authLabel'>
							<div>Email</div>
							<FaUser/>
							<input
								type='email'
								id='email'
								name='email'
								onChange={e => {
									handleInputChange(e);
								}}
								value={authDetails.email}
								placeholder='Email'
							/>
						</label>
					)}
					<div className='authLabel'>
						<label htmlFor='password'>
							<div>Password</div>
							<FaLock/>
							<input
								type={showPasswords.password ? 'text' : 'password'}
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
							{showPasswords.password ? <BsEyeSlashFill/> : <BsEyeFill/>}
						</button>
					</div>
					{isLogin ? null : (
						<div className='authLabel'>
							<label htmlFor='confirmPassword'>
								<div>Confirm Password</div>
								<FaLock/>
								<input
									type={showPasswords.confirmPassword ? 'text' : 'password'}
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
								{showPasswords.confirmPassword ? <BsEyeSlashFill/> : <BsEyeFill/>}
							</button>
						</div>
					)}
					{isLogin && (
						<Link to='/forgotPassword'>
							Forgotten password
						</Link>
					)}
					<button type='submit'>
						{loading ? <Loading isBackground/> : (
							<>
								{isLogin ? 'Login' : 'Signup'}
							</>
						)}
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
}
