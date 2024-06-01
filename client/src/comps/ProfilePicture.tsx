import {type ChangeEvent, useState, useRef} from 'react';
import {type User} from '../types/AuthTypes';
import {type FormEvent} from 'react';
import {usePopup} from '../contexts/PopupContext';
import {request} from '../requests/requests';
import {Loading} from './Loading';
import {BiSave} from 'react-icons/bi';
import {CgClose} from 'react-icons/cg';
import './styles/ProfilePicture.scss';

export function ProfilePicture({user}: {user: User | undefined}) {
	const {setPopup} = usePopup();
	const [loading, setLoading] = useState<boolean>(false);
	const [profilePicture, setProfilePicture] = useState<File | undefined>(undefined);
	const profilePictureRef = useRef<HTMLInputElement>(null);

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
				await request('/updateProfilePicture', 'POST', true, formData);
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
				e.target.value = '';
			}
		} else {
			e.target.value = '';
		}
	};

	const handleOnCancel = () => {
		setProfilePicture(undefined);
		if (profilePictureRef.current) {
			profilePictureRef.current.value = '';
		}
	};

	return (
		<form className='profilePicture' method='POST' onSubmit={async e => {
			await handleSubmit(e);
		}}>
			{profilePicture
				? <img alt='' src={URL.createObjectURL(profilePicture)}/>
				: <img src={user?.profile_picture_url} alt='ProfilePicture' />
			}
			<label className='file' htmlFor={`profilePicture${user?.user_id}`} aria-label='Add Profile Picture'>
				<input
					type='file'
					ref={profilePictureRef}
					id={`profilePicture${user?.user_id}`}
					onChange={e => {
						handleFileChange(e);
					}}
				/>
				{profilePicture
					? <img alt='' src={URL.createObjectURL(profilePicture)}/>
					: <img src={user?.profile_picture_url} alt='ProfilePicture' />
				}
			</label>
			{profilePicture ? (
				<>
					<button type='button' aria-label='Cancel' onClick={() => {
						handleOnCancel();
					}}>
						<CgClose/>
					</button>
					<button type='submit' aria-label='Update Profile Picture'>
						{loading ? <Loading isSubtle/> : <BiSave/>}
					</button>
				</>
			) : null}
		</form>
	);
}
