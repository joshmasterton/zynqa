import {type ErrorResponse} from '../types/requestTypes';

const apiUrl = 'http://localhost:9001';

export const request = async <T, R>(url: string, method: string, body?: T): Promise<R | Error | undefined> => {
	try {
		const requestOptions: RequestInit = {
			method,
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		};

		if (body !== undefined) {
			requestOptions.body = JSON.stringify(body);
		}

		const response = await fetch(apiUrl + url, requestOptions);

		if (!response.ok) {
			const errorData: ErrorResponse = await response.json() as ErrorResponse;
			throw new Error(errorData.error);
		}

		const data: R = await response.json() as R;
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}

		return undefined;
	}
};
