import {type Routes} from './types/AppTypes';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
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
		<LightModeProvider>
			<RouterProvider router={router}/>
		</LightModeProvider>
	);
}
