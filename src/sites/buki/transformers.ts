import { URL_PATTERNS } from './patterns';

export function extractTutorId(url: string): string {
	const match = url.match(URL_PATTERNS.TUTOR_ID);
	return match ? match[1] : '';
}

export function buildPageUrl(baseUrl: string, queryParams: string, pageNumber: number): string {
	const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
	if (pageNumber === 1) {
		return `${cleanBase}/${queryParams}`;
	}

	return `${cleanBase}/${pageNumber}/${queryParams}`;
}
