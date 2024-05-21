import {describe, expect, test} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {PopupProvider} from '../contexts/PopupContext';
import {UserProvider} from '../contexts/UserContext';
import {LightModeProvider} from '../contexts/LightModeContext';
import {RouterProvider, createMemoryRouter} from 'react-router-dom';
import {routes} from '../App';

describe('Auth Components', () => {
	const renderAuth = (initialPath: string) => {
		const router = createMemoryRouter(routes, {initialEntries: [initialPath]});

		return (
			<UserProvider>
				<PopupProvider>
					<LightModeProvider>
						<RouterProvider router={router}/>
					</LightModeProvider>
				</PopupProvider>
			</UserProvider>
		);
	};

	test('Expect Login form to be rendered', () => {
		render(renderAuth('/'));

		expect(screen.getByRole('heading', {name: 'Login'})).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
		expect(screen.getByRole('button', {name: 'Login'})).toBeInTheDocument();
	});

	test('Expect Signup form to be rendered', () => {
		render(renderAuth('/signup'));

		expect(screen.getByRole('heading', {name: 'Signup'})).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
		expect(screen.getByRole('button', {name: 'Signup'})).toBeInTheDocument();
	});

	test('Expect input fields to accept user input', () => {
		render(renderAuth('/'));

		const usernameInput = screen.getByPlaceholderText('Username');
		const passwordInput = screen.getByPlaceholderText('Password');

		fireEvent.change(usernameInput, {target: {value: 'testUser'}});
		fireEvent.change(passwordInput, {target: {value: 'testPassword'}});

		expect(usernameInput).toHaveValue('testUser');
		expect(passwordInput).toHaveValue('testPassword');
	});

	test('Expect password input type to change on show password', () => {
		render(renderAuth('/signup'));

		const passwordInput = screen.getByPlaceholderText('Password');
		const passwordButton = screen.getByLabelText('Show Password');

		fireEvent.click(passwordButton);

		expect(passwordInput).toHaveAttribute('type', 'text');

		fireEvent.click(passwordButton);

		expect(passwordInput).toHaveAttribute('type', 'password');
	});
});
