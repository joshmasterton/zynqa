import {type ReactNode} from 'react';

export type LightModeContextType = {
	lightMode: string;
	changeLightMode: () => void;
};

export type LightModeProviderProps = {
	children: ReactNode;
};
