import {type ChangeEvent, useState} from 'react';
import {type User} from '../types/AuthTypes';
import {type FormEvent} from 'react';
import {usePopup} from '../contexts/PopupContext';
import {request} from '../requests/requests';
import {Loading} from './Loading';
import {BiSave} from 'react-icons/bi';
import './styles/ProfilePicture.scss';

export function ProfilePicture({user}: {user: User | undefined}) {
	const {setPopup} = usePopup();
	const [loading, setLoading] = useState<boolean>(false);
	const [profilePicture, setProfilePicture] = useState<File | undefined>(undefined);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (loading) {
			return;
		}

		try {
			setLoading(true);
			if (profilePicture) {
				const formData = new FormData();
				formData.append('profilePicture', profilePicture);
				await request('/updateProfile', 'POST', true, formData);
				window.location.reload();
			} else {
				setPopup('Choose a profile picture');
			}
		} catch (error) {
			if (error instanceof Error) {
				setPopup(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (e?.target?.files?.[0]) {
			if (validImageTypes.includes(e.target.files[0].type)) {
				setProfilePicture(e?.target?.files?.[0]);
			} else {
				setPopup('Muse be a valid image type');
			}
		}
	};

	return (
		<form className='profilePicture' method='POST' onSubmit={async e => {
			await handleSubmit(e);
		}}>
			<label className='file' htmlFor='profilePicture' aria-label='Add Profile Picture'>
				<input type='file' id='profilePicture' onChange={e => {
					handleFileChange(e);
				}}/>
				{loading ? <Loading/> : (
					<>
						{profilePicture
							? <img alt='' src={URL.createObjectURL(profilePicture)}/>
							: <img src={user?.profile_picture_url} alt='ProfilePicture' />
						}
					</>
				)}
			</label>
			{profilePicture ? (
				<button type='submit' aria-label='Update Profile Picture'>
					<BiSave/>
				</button>
			) : null}
		</form>
	);
}
