import {type Routes} from './types/AppTypes';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import {UserProvider} from './contexts/UserContext';
import {Popup, PopupProvider} from './contexts/PopupContext';
import {LightModeProvider} from './contexts/LightModeContext';
import {ProtectedRoute} from './comps/ProtectedRoute';
import {PublicRoute} from './comps/PublicRoute';
import {ResetPassword} from './pages/ResetPassword';
import {ForgotPassword} from './pages/ForgotPassword';
import {Nav} from './comps/Nav';
import {Auth} from './pages/Auth';
import './styles/App.scss';

export const routes: Routes[] = [
	{
		path: '/*',
		element: (
			<ProtectedRoute>
				<Nav/>
			</ProtectedRoute>
		),
	},
	{
		path: '/login',
		element: (
			<PublicRoute>
				<Auth isLogin/>
			</PublicRoute>
		),
	},
	{
		path: '/signup',
		element: (
			<PublicRoute>
				<Auth isLogin={false}/>
			</PublicRoute>
		),
	},
	{
		path: '/forgotPassword',
		element: (
			<PublicRoute>
				<ForgotPassword/>
			</PublicRoute>
		),
	},
	{
		path: '/resetPassword',
		element: (
			<PublicRoute>
				<ResetPassword/>
			</PublicRoute>
		),
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
