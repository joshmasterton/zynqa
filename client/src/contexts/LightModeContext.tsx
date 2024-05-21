import {createContext, useContext, useState} from 'react';
import {
	type LightModeContextType,
	type LightModeProviderProps,
} from '../types/ContextTypes';
import {BsMoonFill, BsSunFill} from 'react-icons/bs';
import './styles/LightModeContext.scss';

const LightModeContext = createContext<LightModeContextType | undefined>(undefined);

export const LightModeProvider = ({children}: LightModeProviderProps) => {
	const [lightMode, setLightMode] = useState<string>(getLightMode());

	const changeLightMode = () => {
		const currentLightMode = localStorage.getItem('zynqaLightMode');

		if (currentLightMode) {
			if (currentLightMode === 'dark') {
				localStorage.setItem('zynqaLightMode', 'light');
				document.documentElement.className = 'light';
				setLightMode('light');
			} else {
				localStorage.setItem('zynqaLightMode', 'dark');
				document.documentElement.className = 'dark';
				setLightMode('dark');
			}
		} else {
			setLightMode(getLightMode());
		}
	};

	return (
		<LightModeContext.Provider value={{lightMode, changeLightMode}}>
			{children}
		</LightModeContext.Provider>
	);
};

export function LightMode() {
	const {lightMode, changeLightMode} = useLightMode();

	return (
		<div id='lightMode' className={lightMode}>
			<button type='button' className={lightMode === 'dark' ? 'left' : 'right' } onClick={() => {
				changeLightMode();
			}}>
				{lightMode === 'dark' ? <BsMoonFill/> : <BsSunFill/>}
			</button>
		</div>
	);
}

export const useLightMode = () => {
	const context = useContext(LightModeContext);

	if (!context) {
		throw new Error('useLightMode must be used within LightModeProvider');
	}

	return context;
};

export const getLightMode = () => {
	const currentLightMode = localStorage.getItem('zynqaLightMode');

	if (!currentLightMode) {
		localStorage.setItem('zynqaLightMode', 'dark');
		return 'dark';
	}

	return currentLightMode;
};
