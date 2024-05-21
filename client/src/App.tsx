import {type Routes} from './types/AppTypes';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import {UserProvider} from './contexts/UserContext';
import {Popup, PopupProvider} from './contexts/PopupContext';
import {LightModeProvider} from './contexts/LightModeContext';
import {Auth} from './pages/Auth';
import './styles/App.scss';

export const routes: Routes[] = [
	{
		path: '/*',
		element: <Auth isLogin/>,
	},
	{
		path: '/signup',
		element: <Auth isLogin={false}/>,
	},
];

const router = createBrowserRouter(routes);

export function App() {
	return (
		<UserProvider>
			<PopupProvider>
				<LightModeProvider>
					<Popup/>
					<RouterProvider router={router}/>
				</LightModeProvider>
			</PopupProvider>
		</UserProvider>
	);
}
