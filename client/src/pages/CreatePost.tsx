import {type ChangeEvent, useState, type FormEvent} from 'react';
import {useUser} from '../contexts/UserContext';
import {usePopup} from '../contexts/PopupContext';
import {useNavigate} from 'react-router-dom';
import {request} from '../requests/requests';
import {ReturnNav} from '../comps/ReturnNav';
import {Loading} from '../comps/Loading';
import {Side} from '../comps/Side';
import {MdFileUpload} from 'react-icons/md';
import './styles/CreatePost.scss';

export function CreatePost() {
	const {user} = useUser();
	const navigate = useNavigate();
	const {setPopup} = usePopup();
	const [post, setPost] = useState<string>('');
	const [postFile, setPostFile] = useState<File | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (loading) {
			return;
		}

		try {
			setLoading(true);
			if (user) {
				const formData = new FormData();
				formData.append('post', post);
				formData.append('username', user?.username);
				formData.append('email', user?.email);
				formData.append('profile_picture_url', user?.profile_picture_url);

				if (postFile) {
					formData.append('postFile', postFile);
				}

				await request('/createPost', 'POST', true, formData);
				navigate('/');
			}
		} catch (error) {
			if (error instanceof Error) {
				setPopup(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const {value} = e.target;
		setPost(value);
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (e?.target?.files?.[0]) {
			if (validImageTypes.includes(e.target.files[0].type)) {
				setPostFile(e?.target?.files?.[0]);
			} else {
				setPopup('Muse be a valid image type');
			}
		}
	};

	return (
		<div id='createPost'>
			<ReturnNav/>
			<form method='POST' onSubmit={async e => {
				await handleSubmit(e);
			}}>
				<label htmlFor='post'>
					<textarea
						id='post'
						name='post'
						placeholder='Write post content here...'
						onChange={e => {
							handleInputChange(e);
						}}
						maxLength={500}
					/>
				</label>
				<div>
					<div>
						<p>{post.length}</p>
						<div style={{width: `${post.length / 5}%`}}/>
					</div>
					<label className='file' htmlFor='postFile' aria-label='Add Profile Picture'>
						<input type='file' id='postFile' onChange={e => {
							handleFileChange(e);
						}}/>
						{postFile
							? <img alt='' src={URL.createObjectURL(postFile)}/>
							: <MdFileUpload/>}
					</label>
					<button type='submit'>
						{loading ? <Loading isBackground/> : 'Send'}
					</button>
				</div>
			</form>
			<Side/>
		</div>
	);
}
