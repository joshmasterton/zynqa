import escapeHtml from 'escape-html';

export const customSanitizer = (value: string) => {
	const sanitizedValue = (value).replace(/'/g, '');
	return escapeHtml(sanitizedValue);
};
