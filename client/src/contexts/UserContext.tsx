import {
	createContext, useContext, useEffect, useState,
} from 'react';
import {type UserProviderProps, type UserContextType} from '../types/ContextTypes';
import {type User} from '../types/AuthTypes';
import {request} from '../requests/requests';
import {Loading} from '../comps/Loading';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: UserProviderProps) => {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		request<undefined, User>('/getUser', 'GET')
			.then(userData => {
				setUser(userData);
				setLoading(false);
			})
			.catch(error => {
				if (error instanceof Error) {
					console.error(error.message);
					setLoading(false);
				}
			});
	}, []);

	if (loading) {
		return <Loading/>;
	}

	return (
		<UserContext.Provider value={{user, setUser}}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const user = useContext(UserContext);

	if (!user) {
		throw new Error('useUser must be used within UserProvider');
	}

	return user;
};
