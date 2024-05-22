import {useNavigate} from 'react-router-dom';
import {useUser} from '../contexts/UserContext';
import {type ReactNode, useEffect} from 'react';

export function ProtectedRoute({children}: {children: ReactNode}) {
	const user = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user.user) {
			navigate('/login');
		}
	}, [user]);

	if (user.user) {
		return <>{children}</>;
	}
}
