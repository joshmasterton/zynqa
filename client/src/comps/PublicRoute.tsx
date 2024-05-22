import {useNavigate} from 'react-router-dom';
import {useUser} from '../contexts/UserContext';
import {type ReactNode, useEffect} from 'react';

export function PublicRoute({children}: {children: ReactNode}) {
	const user = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (user.user) {
			navigate('/');
		}
	}, [user]);

	if (!user.user) {
		return <>{children}</>;
	}
}
