import {useState} from 'react';
import {useUser} from '../contexts/UserContext';
import {request} from '../requests/requests';
import {Loading} from './Loading';
import {Link, useNavigate} from 'react-router-dom';
import {ProfilePicture} from './ProfilePicture';
import {LightMode} from '../contexts/LightModeContext';
import {BiChevronLeft} from 'react-icons/bi';
import {
	RiGroup3Fill, RiLogoutBoxFill, RiMessage3Fill, RiUser3Fill,
} from 'react-icons/ri';
import './styles/ReturnNav.scss';

export function ReturnNav() {
	const navigate = useNavigate();
	const {user, setUser} = useUser();
	const [loading, setLoading] = useState<boolean>(false);

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

	return (
		<nav id='returnNav'>
			<div/>
			<header>
				<button type='button' aria-label='Back' onClick={() => {
					navigate(-1);
				}}>
					<BiChevronLeft/>
				</button>
				<LightMode/>
			</header>
			<main>
				<ul>
					<ProfilePicture user={user}/>
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
						<Link to='/'>
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
		</nav>
	);
}
