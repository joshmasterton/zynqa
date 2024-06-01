import {Link} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {useUser} from '../contexts/UserContext';
import {request} from '../requests/requests';
import {Loading} from './Loading';
import {LightMode, useLightMode} from '../contexts/LightModeContext';
import {BiMenu} from 'react-icons/bi';
import logoLight from '../styles/zynqa_logo_light.png';
import logoDark from '../styles/zynqa_logo_dark.png';
import {
	RiGroup3Fill, RiLogoutBoxFill, RiMessage3Fill, RiUser3Fill,
} from 'react-icons/ri';
import './styles/Nav.scss';

export function Nav() {
	const {user, setUser} = useUser();
	const {lightMode} = useLightMode();
	const [loading, setLoading] = useState<boolean>(false);
	const [isMenu, setIsMenu] = useState<boolean>(false);

	const handleIsMenu = () => {
		setIsMenu(!isMenu);
	};

	const logout = async () => {
		if (loading) {
			return;
		}

		try {
			setLoading(true);
			await request('/logout', 'GET');
			setUser(undefined);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleScroll = () => {
		setIsMenu(false);
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<nav id='nav'>
			<div/>
			<header>
				<div>
					<img src={user?.profile_picture_url} alt='ProfilePicture' />
					<img src={lightMode === 'dark' ? logoLight : logoDark} alt='Logo' />
					<button type='button' aria-label='Menu' onClick={() => {
						handleIsMenu();
					}}>
						<BiMenu/>
					</button>
				</div>
			</header>
			<main>
				<ul>
					<img src={user?.profile_picture_url} alt='ProfilePicture' />
					<li>
						<div>{user?.username}</div>
						<p>{user?.email}</p>
					</li><li>
						<Link to='/'>
							<RiMessage3Fill />
							Posts
						</Link>
					</li><li>
						<Link to='/'>
							<RiGroup3Fill />
							Friends
						</Link>
					</li><li>
						<Link to={`profile/${user?.username}`}>
							<RiUser3Fill />
							Profile
						</Link>
					</li><li>
						<button type='button' onClick={async () => {
							await logout();
						} }>
							<RiLogoutBoxFill />
							<div>Logout</div>
							{loading ? <Loading isSubtle/> : null}
						</button>
					</li>
					<LightMode />
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
						<Link to={`/profile/${user?.username}`}>
							<RiUser3Fill/>
							Profile
						</Link>
					</li>
					<li>
						<button type='button' onClick={async () => {
							await logout();
						}}>
							<RiLogoutBoxFill/>
							<div>Logout</div>
							{loading ? <Loading isSubtle/> : null}
						</button>
					</li>
					<LightMode/>
				</ul>
			</footer>
		</nav>
	);
}
