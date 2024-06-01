import {type User} from '../types/AuthTypes';
import {ReturnNav} from '../comps/ReturnNav';
import {useUser} from '../contexts/UserContext';
import {useEffect, useState} from 'react';
import {request} from '../requests/requests';
import {ProfilePicture} from '../comps/ProfilePicture';
import {Side} from '../comps/Side';
import {FaUser} from 'react-icons/fa';
import {MdEmail} from 'react-icons/md';
import './styles/Profile.scss';

export function Profile() {
	const {user} = useUser();
	const [profile, setProfile] = useState<User | undefined>(undefined);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const profileName = window.location.href.split('/').pop();

	useEffect(() => {
		const getUser = async () => {
			const user = await request<unknown, User>(`/getProfile?username=${profileName}`, 'GET');
			if (user) {
				setProfile(user);
			}
		};

		getUser()
			.catch(error => {
				if (error instanceof Error) {
					console.error(error.message);
				}
			});
	}, []);

	return (
		<div id='profile'>
			<ReturnNav/>
			<div className='profile'>
				<header>
					{profileName === user?.username ? (
						<ProfilePicture user={profile}/>
					) : (
						<div className='userImage'>
							<img src={profile?.profile_picture_url} alt='ProfilePicture' />
							<img src={profile?.profile_picture_url} alt='ProfilePicture' />
						</div>
					)}
					{isEdit && user?.username === profileName ? (
						<form method='POST' autoComplete='none'>
							<label htmlFor='username'>
								<FaUser/>
								<input
									type='text'
									id='username'
									name='username'
									placeholder='Username'
									value={profile?.username}
									readOnly
								/>
							</label>
							<label htmlFor='email'>
								<MdEmail/>
								<input
									type='email'
									id='email'
									name='email'
									placeholder='Email'
									value={profile?.email}
									readOnly
								/>
							</label>
							<button type='button' onClick={() => {
								setIsEdit(!isEdit);
							}}>
								Save
							</button>
						</form>
					) : (
						<div>
							<div>{profile?.username}</div>
							<p>{profile?.email}</p>
						</div>
					)}
				</header>
				<main>
					<div>
						<div>Karma</div>
						|
						<div>{(profile?.likes ?? 0) - (profile?.dislikes ?? 0)}</div>
					</div>
					<div>
						<div>Posts</div>
						|
						<div>{profile?.posts}</div>
					</div>
					<div>
						<div>Friends</div>
						|
						<div>{profile?.friends}</div>
					</div>
				</main>
				{user?.username !== profileName && (
					<footer>
						<button type='button' aria-label='Add'>
							Add
						</button>
						<button type='button' aria-label='Add'>
							Remove
						</button>
					</footer>
				)}
			</div>
			<div className='postsList'>
				<div/>
			</div>
			<Side/>
		</div>
	);
}
