import {type PostType} from '../types/PostTypes';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Nav} from '../comps/Nav';
import {Post} from '../comps/Post';
import {Side} from '../comps/Side';
import {request} from '../requests/requests';
import {Loading} from '../comps/Loading';
import {FaPenClip} from 'react-icons/fa6';
import './styles/Posts.scss';

export function Posts() {
	const [loading, setLoading] = useState<boolean>(false);
	const [posts, setPosts] = useState<PostType[] | undefined>(undefined);

	const getPosts = async () => {
		if (loading) {
			return;
		}

		try {
			setLoading(true);
			const postsFromRequest = await request<unknown, PostType[]>('/getPosts', 'GET');
			if (postsFromRequest) {
				setPosts(postsFromRequest);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getPosts()
			.catch(error => {
				if (error instanceof Error) {
					console.error(error.message);
				}
			});
	}, []);

	return (
		<div id='posts'>
			<Nav/>
			{loading ? <Loading/> : (
				posts?.map(post => (
					<Post key={post.post_id} post={post}/>
				))
			)}
			{posts?.length === 0 && <h2>No posts</h2>}
			<Link className='fixedButton' to='/createPost'>
				<FaPenClip/>
			</Link>
			<Side/>
		</div>
	);
}
