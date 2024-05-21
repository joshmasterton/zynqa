import {
	createContext, useContext, useEffect, useState,
} from 'react';
import {type PopupContextType, type PopupProviderProps} from '../types/ContextTypes';
import './styles/PopupContext.scss';

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({children}: PopupProviderProps) => {
	const [popup, setPopup] = useState<string | undefined>(undefined);
	const [isPopup, setIsPopup] = useState<boolean>(false);

	return (
		<PopupContext.Provider value={{
			popup, setPopup, isPopup, setIsPopup,
		}}>
			{children}
		</PopupContext.Provider>
	);
};

export function Popup() {
	const {popup, isPopup, setPopup, setIsPopup} = usePopup();

	useEffect(() => {
		if (popup) {
			setIsPopup(true);
		}
	}, [popup]);

	useEffect(() => {
		if (!isPopup) {
			setTimeout(() => {
				setPopup(undefined);
			}, 400);
		}
	}, [isPopup]);

	const handleClosePopup = () => {
		if (isPopup) {
			setIsPopup(false);
		}
	};

	return (
		<div id='popup' className={isPopup ? 'open' : 'closed'}>
			<div>
				{popup}
				<button type='button' onClick={() => {
					handleClosePopup();
				}}>
					Okay
				</button>
			</div>
			<button type='button' aria-label='Close popup' onClick={() => {
				handleClosePopup();
			}}/>
		</div>
	);
}

export const usePopup = () => {
	const context = useContext(PopupContext);

	if (!context) {
		throw new Error('usePopup must be used within PopupProvider');
	}

	return context;
};
