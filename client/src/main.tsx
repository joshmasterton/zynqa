import React from 'react';
import ReactDOM from 'react-dom/client';
import {getLightMode} from './contexts/LightModeContext.tsx';
import {App} from './App.tsx';
import './styles/Reset.scss';

document.documentElement.className = getLightMode();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
