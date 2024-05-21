import {type ErrorResponse} from '../types/requestTypes';

const apiUrl = 'http://localhost:9001';

export const request = async <T, R>(url: string, method: string, isFormData = false, body?: T): Promise<R | undefined> => {
	try {
		const requestOptions: RequestInit = {
			method,
			headers: isFormData ? {} : {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		};

		if (body !== undefined) {
			requestOptions.body = isFormData ? body as BodyInit : JSON.stringify(body);
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
