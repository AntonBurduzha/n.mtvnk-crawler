export const LIST_SELECTORS = {
	PROFILE_LINK: 'a[href^="/user-"]',
	ALL_LINKS: 'a',
} as const;

export const PROFILE_SELECTORS = {
	NAME: 'h1',
	RATING_CONTAINER: 'h1 *',
	SHORT_DESCRIPTION: 'h1 + p, h1 ~ p:first-of-type',
	TEACHING_LEVELS: 'li',
	DT: 'dt',
	DD: 'dd',
	DT_DD: 'dt, dd',
	BIO_ELEMENTS: 'h2, p',
	ALL: '*',
} as const;

export const NAME_REMOVE_SELECTORS = ['div', 'span'];

export const STRUCTURED_LABELS = {
	EDUCATION: 'Освіта',
	EXPERIENCE: 'Досвід',
	AGE: 'Вік',
} as const;

export const BIO_HEADER = 'Про себе';
