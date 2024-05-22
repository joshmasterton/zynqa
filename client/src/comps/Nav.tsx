import {Link} from 'react-router-dom';
import {useState} from 'react';
import {useUser} from '../contexts/UserContext';
import {request} from '../requests/requests';
import {LightMode} from '../contexts/LightModeContext';
import {BiMenu} from 'react-icons/bi';
import {
	RiGroup3Fill, RiLogoutBoxFill, RiMessage3Fill, RiUser3Fill,
} from 'react-icons/ri';
import './styles/Nav.scss';

export function Nav() {
	const {user, setUser} = useUser();
	const [isMenu, setIsMenu] = useState<boolean>(false);

	const handleIsMenu = () => {
		setIsMenu(!isMenu);
	};

	const logout = async () => {
		try {
			await request('/logout', 'GET');
			setUser(undefined);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	};

	return (
		<div id='nav'>
			<header>
				<img src={user?.profile_picture_url} alt='ProfilePicture' />
				<ul>
					<li>
						<img src={user?.profile_picture_url} alt='ProfilePicture' />
						<div>{user?.username}</div>
						<p>{user?.email}</p>
					</li>
					<li>
						<Link to='/'>
							<RiMessage3Fill/>
							Posts
						</Link>
					</li>
					<li>
						<Link to='/'>
							<RiGroup3Fill/>
							Friends
						</Link>
					</li>
					<li>
						<Link to='/'>
							<RiUser3Fill/>
							Profile
						</Link>
					</li>
					<li>
						<button type='button' onClick={async () => {
							await logout();
						}}>
							<RiLogoutBoxFill/>
							Logout
						</button>
					</li>
					<LightMode/>
				</ul>
				<button type='button' aria-label='Menu' onClick={() => {
					handleIsMenu();
				}}>
					<BiMenu/>
				</button>
			</header>
			<main>
				<ul>
					<li>
						<img src={user?.profile_picture_url} alt='ProfilePicture' />
						<div>{user?.username}</div>
						<p>{user?.email}</p>
					</li>
					<li>
						<Link to='/'>
							<RiMessage3Fill/>
							Posts
						</Link>
					</li>
					<li>
						<Link to='/'>
							<RiGroup3Fill/>
							Friends
						</Link>
					</li>
					<li>
						<Link to='/'>
							<RiUser3Fill/>
							Profile
						</Link>
					</li>
					<li>
						<button type='button' onClick={async () => {
							await logout();
						}}>
							<RiLogoutBoxFill/>
							Logout
						</button>
					</li>
					<LightMode/>
				</ul>
			</main>
			<footer className={isMenu ? 'open' : 'closed'}>
				<ul>
					<li>
						<Link to='/'>
							<RiMessage3Fill/>
							Posts
						</Link>
					</li>
					<li>
						<Link to='/'>
							<RiGroup3Fill/>
							Friends
						</Link>
					</li>
					<li>
						<Link to='/'>
							<RiUser3Fill/>
							Profile
						</Link>
					</li>
					<li>
						<button type='button' onClick={async () => {
							await logout();
						}}>
							<RiLogoutBoxFill/>
							Logout
						</button>
					</li>
					<LightMode/>
				</ul>
			</footer>
		</div>
	);
}
