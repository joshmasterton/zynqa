import {type ChangeEvent, type FormEvent, useState} from 'react';
import {type NewDetails, type ShowNewPasswords} from '../types/AuthTypes';
import {Link, useNavigate} from 'react-router-dom';
import {request} from '../requests/requests';
import {usePopup} from '../contexts/PopupContext';
import {Loading} from '../comps/Loading';
import {LightMode, useLightMode} from '../contexts/LightModeContext';
import {FaLock} from 'react-icons/fa';
import {BsEyeFill, BsEyeSlashFill} from 'react-icons/bs';
import {BiEnvelope} from 'react-icons/bi';
import {GiToken} from 'react-icons/gi';
import logoLight from '../styles/zynqa_logo_light.png';
import logoDark from '../styles/zynqa_logo_dark.png';

export function ResetPassword() {
	const navigate = useNavigate();
	const {setPopup} = usePopup();
	const {lightMode} = useLightMode();
	const [loading, setLoading] = useState<boolean>(false);
	const [showPasswords, setShowPasswords] = useState<ShowNewPasswords>({
		newPassword: false,
		confirmNewPassword: false,
	});

	const [newDetails, setNewDetails] = useState<NewDetails>({
		email: '',
		token: '',
		newPassword: '',
		confirmNewPassword: '',
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const {name, value} = e.target;
		setNewDetails(prevState => ({
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
			await request('/resetPassword', 'POST', false, newDetails);
			navigate('/login');
		} catch (error) {
			if (error instanceof Error) {
				setPopup(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleShowPassword = (password: keyof ShowNewPasswords) => {
		setShowPasswords(prevState => ({
			...prevState,
			[password]: !prevState[password],
		}));
	};

	return (
		<form id='auth' onSubmit={async e => {
			await handleSubmit(e);
		}} noValidate>
			<img alt='Logo' src={lightMode === 'dark' ? logoLight : logoDark} className='logo'/>
			<header>
				<h1>Reset password</h1>
			</header>
			<main>
				<label htmlFor='email' className='authLabel'>
					<div>Email</div>
					<BiEnvelope/>
					<input
						type='email'
						id='email'
						name='email'
						onChange={e => {
							handleInputChange(e);
						}}
						value={newDetails.email}
						placeholder='Email'
					/>
				</label>
				<label htmlFor='token' className='authLabel'>
					<div>Token</div>
					<GiToken/>
					<input
						type='text'
						id='token'
						name='token'
						onChange={e => {
							handleInputChange(e);
						}}
						value={newDetails.token}
						placeholder='Token'
					/>
				</label>
				<div className='authLabel'>
					<label htmlFor='newPassword'>
						<div>New password</div>
						<FaLock/>
						<input
							type={showPasswords.newPassword ? 'text' : 'password'}
							id='newPassword'
							name='newPassword'
							onChange={e => {
								handleInputChange(e);
							}}
							value={newDetails.newPassword}
							placeholder='New password'
						/>
					</label>
					<button type='button' aria-label='Show Password' onClick={() => {
						handleShowPassword('newPassword');
					}}>
						{showPasswords.newPassword ? <BsEyeSlashFill/> : <BsEyeFill/>}
					</button>
				</div>
				<div className='authLabel'>
					<label htmlFor='confirmNewPassword'>
						<div>Confirm new password</div>
						<FaLock/>
						<input
							type={showPasswords.confirmNewPassword ? 'text' : 'password'}
							id='confirmNewPassword'
							name='confirmNewPassword'
							onChange={e => {
								handleInputChange(e);
							}}
							value={newDetails.confirmNewPassword}
							placeholder='Confirm new password'
						/>
					</label>
					<button type='button' aria-label='Show Password' onClick={() => {
						handleShowPassword('confirmNewPassword');
					}}>
						{showPasswords.newPassword ? <BsEyeSlashFill/> : <BsEyeFill/>}
					</button>
				</div>
				<Link to='/login'>
					{'Don\'t need to reset password?'}
				</Link>
				<button type='submit'>
					{loading ? <Loading isBackground/> : 'Update password'}
				</button>
			</main>
			<LightMode/>
		</form>
	);
}
