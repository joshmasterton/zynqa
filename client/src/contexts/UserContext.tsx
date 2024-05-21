import {
	createContext, useContext, useEffect, useState,
} from 'react';
import {type UserProviderProps, type UserContextType} from '../types/ContextTypes';
import {type User} from '../types/AuthTypes';
import {request} from '../requests/requests';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: UserProviderProps) => {
	const [user, setUser] = useState<User | undefined>(undefined);

	useEffect(() => {
		request<undefined, User>('/getUser', 'GET')
			.then(userData => {
				if (userData) {
					setUser(userData);
				}
			})
			.catch(error => {
				if (error instanceof Error) {
					console.error(error.message);
				}
			});
	}, []);

	return (
		<UserContext.Provider value={{user}}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('useUser must be used within UserProvider');
	}

	return context;
};
