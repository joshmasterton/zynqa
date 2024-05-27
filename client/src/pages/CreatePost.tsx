import {
	type ChangeEvent, useState, type FormEvent, useRef,
	useEffect,
} from 'react';
import {useUser} from '../contexts/UserContext';
import {usePopup} from '../contexts/PopupContext';
import {useNavigate} from 'react-router-dom';
import {request} from '../requests/requests';
import {ReturnNav} from '../comps/ReturnNav';
import {Loading} from '../comps/Loading';
import {Side} from '../comps/Side';
import {CgClose} from 'react-icons/cg';
import {MdFileUpload} from 'react-icons/md';
import './styles/CreatePost.scss';

export function CreatePost() {
	const {user} = useUser();
	const navigate = useNavigate();
	const {setPopup} = usePopup();
	const [post, setPost] = useState<string>('');
	const [postFile, setPostFile] = useState<File | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const postFileRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

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
		} else if (e.target) {
			e.target.value = '';
		}
	};

	const handleRemoveFile = () => {
		if (postFileRef.current) {
			postFileRef.current.value = '';
		}

		setPostFile(undefined);
	};

	const handleResizeTextarea = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	useEffect(() => {
		handleResizeTextarea();
	}, [post, postFile]);

	useEffect(() => {
		window.addEventListener('resize', handleResizeTextarea);

		return () => {
			window.removeEventListener('resize', handleResizeTextarea);
		};
	}, []);

	return (
		<div id='createPost'>
			<ReturnNav/>
			<form method='POST' onSubmit={async e => {
				await handleSubmit(e);
			}}>
				<label htmlFor='post' style={postFile ? {flex: 'none'} : {flex: '1'}}>
					<textarea
						id='post'
						name='post'
						style={{flex: postFile ? 'none' : '1'}}
						ref={textareaRef}
						placeholder='Write post here...'
						onChange={e => {
							handleInputChange(e);
						}}
						maxLength={500}
					/>
				</label>
				{postFile && (
					<div id='createPostFile'>
						<img alt='' src={URL.createObjectURL(postFile)}/>
						<img alt='' src={URL.createObjectURL(postFile)}/>
						<button type='button' onClick={() => {
							handleRemoveFile();
						}}>
							<CgClose/>
						</button>
					</div>
				)}
				<div>
					<div>
						<p>{post.length}</p>
						<div style={{width: `${post.length / 5}%`}}/>
					</div>
					<label className='file' htmlFor='postFile' aria-label='Add Profile Picture'>
						<input ref={postFileRef} type='file' id='postFile' onChange={e => {
							handleFileChange(e);
						}}/>
						<MdFileUpload/>
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
