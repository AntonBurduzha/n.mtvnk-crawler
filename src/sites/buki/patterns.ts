export const URL_PATTERNS = {
	PROFILE_URL: /^\/user-\d+\/?$/,
	TUTOR_ID: /user-(\d+)/,
	PAGINATION: /\/(\d+)\//,
} as const;

export const PROFILE_PATTERNS = {
	RATING: /^(\d\.\d|\d)$/,
	REVIEWS_COUNT: /відгуків:\s*(\d+)/i,
	PRICE_PER_HOUR: /(\d+)\s*грн\/год/,
} as const;

export const TEACHING_LEVEL_KEYWORDS = [
	'клас',
	'рівень',
	'курс',
	'підготовка',
	'мова',
	'DELF',
	'DALF',
	'TCF',
	'початківц',
	'розмовн',
	'ділов',
	'бізнес',
	'граматик',
] as const;

export const TEACHING_LEVEL_MAX_LENGTH = 50;

export const BIO_MIN_LENGTH = 50;
