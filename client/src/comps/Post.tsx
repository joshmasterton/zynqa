import {type PostType} from '../types/PostTypes';
import {FaArrowDown, FaArrowUp} from 'react-icons/fa';
import {BiSolidComment} from 'react-icons/bi';
import './styles/Post.scss';

export function Post({post}: {post: PostType}) {
	return (
		<div className='post'>
			<header>
				<img alt='' src={post?.profile_picture_url}/>
				<div>
					<p>{post?.username}</p>
					<p>{post?.email}</p>
				</div>
			</header>
			<main>
				{post?.post}
				{post?.post_picture && (
					<div>
						<img alt='Post Picture' src={post?.post_picture}/>
						<img alt='Post Picture' src={post?.post_picture}/>
					</div>
				)}
			</main>
			<footer>
				<button type='button' aria-label='Like'>
					<FaArrowUp/>
					<p>{post?.likes}</p>
				</button>
				<button type='button' aria-label='Dislike'>
					<FaArrowDown/>
					<p>{post?.dislikes}</p>
				</button>
				<button type='button' aria-label='Comment'>
					<BiSolidComment/>
					<p>{post?.dislikes}</p>
				</button>
			</footer>
		</div>
	);
}
