import {type ChangeEvent, type FormEvent, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {request} from '../requests/requests';
import {Loading} from '../comps/Loading';
import {LightMode} from '../contexts/LightModeContext';
import {usePopup} from '../contexts/PopupContext';
import {BiEnvelope} from 'react-icons/bi';
import logo from '../styles/zynqa_logo.png';

export function ForgotPassword() {
	const navigate = useNavigate();
	const {setPopup} = usePopup();
	const [loading, setLoading] = useState<boolean>(false);
	const [email, setEmail] = useState<string>('joshmasterton@tuta.io');

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const {value} = e.target;
		setEmail(value);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (loading) {
			return;
		}

		try {
			setLoading(true);
			await request('/forgotPassword', 'POST', false, {email});
			navigate('/resetPassword');
		} catch (error) {
			if (error instanceof Error) {
				setPopup(error.message);
			}
		}	finally {
			setLoading(false);
		}
	};

	return (
		<form id='auth' onSubmit={async e => {
			await handleSubmit(e);
		}} noValidate>
			<img alt='Logo' src={logo} className='logo'/>
			<header>
				<h1>Forgot password</h1>
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
						value={email}
						placeholder='Email'
					/>
				</label>
				<Link to='/login'>
					{'Don\'t need to reset password?'}
				</Link>
				<button type='submit'>
					{loading ? <Loading isBackground/> : 'Send email'}
				</button>
			</main>
			<LightMode/>
		</form>
	);
}
