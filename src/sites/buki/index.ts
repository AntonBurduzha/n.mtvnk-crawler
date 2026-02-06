import type { Page } from 'puppeteer';
import type { SiteAdapter, ProfileFieldExtractor, TutorProfile } from '@/types';
import { createTextExtractor } from '@/extractors/text';
import {
	createPatternExtractor,
	createBoundedNumericExtractor,
	createNumericPatternExtractor,
} from '@/extractors/pattern';
import {
	createStructuredExtractor,
	createListExtractor,
	createAfterHeaderExtractor,
} from '@/extractors/structured';
import { createProfileFieldExtractor } from '@/extractors/base';
import {
	LIST_SELECTORS,
	PROFILE_SELECTORS,
	NAME_REMOVE_SELECTORS,
	STRUCTURED_LABELS,
	BIO_HEADER,
} from './selectors';
import {
	URL_PATTERNS,
	PROFILE_PATTERNS,
	TEACHING_LEVEL_KEYWORDS,
	TEACHING_LEVEL_MAX_LENGTH,
	BIO_MIN_LENGTH,
} from './patterns';
import { extractTutorId, buildPageUrl } from './transformers';

function createProfileExtractors(): ProfileFieldExtractor<keyof TutorProfile>[] {
	return [
		createProfileFieldExtractor('name', 'buki-name', async page => {
			const nameExtractor = createTextExtractor('name-inner', {
				selector: PROFILE_SELECTORS.NAME,
				removeSelectors: NAME_REMOVE_SELECTORS,
			});
			return nameExtractor.extract(page);
		}),
		createProfileFieldExtractor('rating', 'buki-rating', async page => {
			const ratingExtractor = createBoundedNumericExtractor(
				'rating-inner',
				PROFILE_SELECTORS.RATING_CONTAINER,
				PROFILE_PATTERNS.RATING,
				1,
				5,
			);
			return ratingExtractor.extract(page);
		}),
		createProfileFieldExtractor('reviewsCount', 'buki-reviews', async page => {
			const reviewsExtractor = createPatternExtractor<number>('reviews-inner', {
				selector: PROFILE_SELECTORS.NAME,
				pattern: PROFILE_PATTERNS.REVIEWS_COUNT,
				transform: captured => parseInt(captured, 10),
			});
			const result = await reviewsExtractor.extract(page);
			return result ?? 0;
		}),
		createProfileFieldExtractor('pricePerHour', 'buki-price', async page => {
			const priceExtractor = createNumericPatternExtractor(
				'price-inner',
				PROFILE_SELECTORS.ALL,
				PROFILE_PATTERNS.PRICE_PER_HOUR,
			);
			const result = await priceExtractor.extract(page);
			return result ?? 0;
		}),
		createProfileFieldExtractor('shortDescription', 'buki-short-desc', async page => {
			const descExtractor = createTextExtractor('short-desc-inner', {
				selector: PROFILE_SELECTORS.SHORT_DESCRIPTION,
			});
			return descExtractor.extract(page);
		}),
		createProfileFieldExtractor('teachingLevels', 'buki-teaching-levels', async page => {
			const levelsExtractor = createListExtractor('levels-inner', {
				selector: PROFILE_SELECTORS.TEACHING_LEVELS,
				keywords: [...TEACHING_LEVEL_KEYWORDS],
				maxLength: TEACHING_LEVEL_MAX_LENGTH,
			});
			const result = await levelsExtractor.extract(page);
			return result ?? [];
		}),
		createProfileFieldExtractor('education', 'buki-education', async page => {
			const eduExtractor = createStructuredExtractor('education-inner', {
				label: STRUCTURED_LABELS.EDUCATION,
			});
			return eduExtractor.extract(page);
		}),
		createProfileFieldExtractor('experience', 'buki-experience', async page => {
			const expExtractor = createStructuredExtractor('experience-inner', {
				label: STRUCTURED_LABELS.EXPERIENCE,
			});
			return expExtractor.extract(page);
		}),
		createProfileFieldExtractor('ageRange', 'buki-age', async page => {
			const ageExtractor = createStructuredExtractor('age-inner', {
				label: STRUCTURED_LABELS.AGE,
			});
			return ageExtractor.extract(page);
		}),
		createProfileFieldExtractor('bio', 'buki-bio', async page => {
			const bioExtractor = createAfterHeaderExtractor(
				'bio-inner',
				BIO_HEADER,
				'h2',
				'p',
				BIO_MIN_LENGTH,
			);
			return bioExtractor.extract(page);
		}),
	];
}

export const bukiAdapter: SiteAdapter = {
	name: 'buki',
	domain: 'buki.com.ua',
	getProfileUrlSelector(): string {
		return LIST_SELECTORS.PROFILE_LINK;
	},
	getProfileUrlPattern(): RegExp {
		return URL_PATTERNS.PROFILE_URL;
	},
	getProfileExtractors(): ProfileFieldExtractor<keyof TutorProfile>[] {
		return createProfileExtractors();
	},
	hasNextPage(currentPage: number): (page: Page) => Promise<boolean> {
		const nextPage = currentPage + 1;

		return async (page: Page): Promise<boolean> => {
			return page.$$eval(
				LIST_SELECTORS.ALL_LINKS,
				(links, nextPageNum) => {
					return links.some(link => {
						const href = link.getAttribute('href') || '';
						return href.includes(`/${nextPageNum}/`) && href.includes('tutors-online');
					});
				},
				nextPage,
			);
		};
	},
	buildPageUrl(baseUrl: string, queryParams: string, pageNumber: number): string {
		return buildPageUrl(baseUrl, queryParams, pageNumber);
	},
	extractId(url: string): string {
		return extractTutorId(url);
	},
};
