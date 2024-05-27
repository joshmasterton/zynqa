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
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
	const [posts, setPosts] = useState<PostType[] | undefined>(undefined);
	const [page, setPage] = useState<number>(0);

	const getPosts = async () => {
		if (loading || loadingMore) {
			return;
		}

		try {
			if (posts && posts?.length > 0) {
				setLoadingMore(true);
			} else {
				setLoading(true);
			}

			const postsFromRequest = await request<unknown, PostType[]>(`/getPosts?page=${page}`, 'GET');
			if (postsFromRequest && postsFromRequest.length > 0) {
				if (page > 0) {
					setPosts(prevPosts => {
						if (prevPosts) {
							return [...prevPosts, ...postsFromRequest];
						}

						return postsFromRequest;
					});
				} else {
					setPosts(postsFromRequest);
				}

				setPage(page + 1);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};

	useEffect(() => {
		if (!posts) {
			getPosts()
				.catch(error => {
					if (error instanceof Error) {
						console.error(error.message);
					}
				});
		}
	}, []);

	return (
		<div id='posts'>
			<Nav/>
			<div id='postsList'>
				{loading ? <Loading isSubtle/> : (
					<>
						{posts?.map(post => (
							<Post key={post.post_id} post={post}/>
						))}
						{posts && posts?.length > 0 && (
							<div>
								<button type='button' onClick={async () => {
									await getPosts();
								}}>
									{loadingMore ? <Loading isSubtle/> : 'Load More...'}
								</button>
							</div>
						)}
						{posts?.length === 0 && !loading && <h2>No posts</h2>}
					</>
				)}
			</div>
			<Link className='fixedButton' to='/createPost'>
				<FaPenClip/>
			</Link>
			<Side/>
		</div>
	);
}
