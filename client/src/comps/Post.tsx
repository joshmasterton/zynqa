/* eslint-disable @typescript-eslint/naming-convention */
import {type HasLikedDisliked, type PostType} from '../types/PostTypes';
import {useEffect, useState} from 'react';
import {useUser} from '../contexts/UserContext';
import {usePopup} from '../contexts/PopupContext';
import {request} from '../requests/requests';
import {FaArrowDown, FaArrowUp} from 'react-icons/fa';
import {BiSolidComment} from 'react-icons/bi';
import './styles/Post.scss';

export function Post({post}: {post: PostType}) {
	const {user} = useUser();
	const {setPopup} = usePopup();
	const [currentPost, setCurrentPost] = useState<PostType>(post);
	const [hasLikedDislike, setHasLikedDisliked] = useState<string | undefined>(undefined);

	const postCreatedAt: number = new Date(currentPost.created_at).getTime();
	const timeNow: number = Date.now();
	const timeDifference = timeNow - postCreatedAt;
	const minutesDifference = Math.floor(timeDifference / (1000 * 60));
	const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
	const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	let createdAt: string;

	if (minutesDifference === 0) {
		createdAt = 'Just now';
	} else if (minutesDifference < 60) {
		createdAt = `${minutesDifference}m`;
	} else if (hoursDifference < 24) {
		createdAt = `${hoursDifference}h`;
	} else {
		createdAt = `${daysDifference}d`;
	}

	const hasLikedDisliked = async () => {
		const getHasLikedDisliked = await request<unknown, HasLikedDisliked>(`/hasLikedDisliked?post_id=${post.post_id}`, 'GET');
		if (getHasLikedDisliked?.type) {
			setHasLikedDisliked(getHasLikedDisliked.type);
		} else {
			setHasLikedDisliked(undefined);
		}
	};

	const onLikeDislike = async (type: string) => {
		try {
			const updatedPost = await request<unknown, PostType>('/likeDislike', 'POST', false, {
				type,
				post_id: post.post_id.toString(),
				username: user?.username,
			});

			if (updatedPost) {
				setCurrentPost(updatedPost);
				await hasLikedDisliked();
			}
		} catch (error) {
			if (error instanceof Error) {
				setPopup(error.message);
			}
		}
	};

	useEffect(() => {
		hasLikedDisliked()
			.catch(error => {
				if (error instanceof Error) {
					console.error(error.message);
				}
			});
	}, []);

	return (
		<div className='post'>
			<header>
				<img alt='' src={currentPost?.profile_picture_url}/>
				<div>
					<div>
						<div>
							{currentPost?.username}
						</div>
						-
						<p>{createdAt}</p>
					</div>
					<p>{currentPost?.email}</p>
				</div>
			</header>
			<main>
				{currentPost?.post}
				{currentPost?.post_picture && (
					<div>
						<img alt='Post Picture' src={post?.post_picture}/>
						<img alt='Post Picture' src={post?.post_picture}/>
					</div>
				)}
			</main>
			<footer>
				<button type='button' aria-label='Like'
					className={hasLikedDislike === 'like' ? 'active' : undefined} onClick={async () => {
						await onLikeDislike('like');
					}}
				>
					<FaArrowUp/>
					<p>{currentPost?.likes}</p>
				</button>
				<button type='button' aria-label='Dislike'
					className={hasLikedDislike === 'dislike' ? 'active' : undefined}	onClick={async () => {
						await onLikeDislike('dislike');
					}}
				>
					<FaArrowDown/>
					<p>{currentPost?.dislikes}</p>
				</button>
				<button type='button' aria-label='Comment'>
					<BiSolidComment/>
					<p>{currentPost?.comments}</p>
				</button>
			</footer>
		</div>
	);
}
