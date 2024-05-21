import {type Dispatch, type SetStateAction, type ReactNode} from 'react';
import {type User} from './AuthTypes';

export type LightModeContextType = {
	lightMode: string;
	changeLightMode: () => void;
};

export type LightModeProviderProps = {
	children: ReactNode;
};

export type PopupContextType = {
	popup: string | undefined;
	setPopup: Dispatch<SetStateAction<string | undefined>>;
	isPopup: boolean;
	setIsPopup: Dispatch<SetStateAction<boolean>>;
};

export type PopupProviderProps = {
	children: ReactNode;
};

export type UserContextType = {
	user: User | undefined;
};

export type UserProviderProps = {
	children: ReactNode;
};

