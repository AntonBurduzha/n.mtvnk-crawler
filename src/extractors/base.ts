import type { Page } from 'puppeteer';
import { logger } from '@/core/logger';
import type { Extractor, ProfileFieldExtractor, TutorProfile } from '@/types';

export function createExtractor<T>(
	name: string,
	extractFn: (page: Page) => Promise<T | null>,
): Extractor<T> {
	return {
		name,
		async extract(page: Page): Promise<T | null> {
			try {
				const result = await extractFn(page);
				logger.trace({ extractor: name, hasResult: result !== null }, 'Extraction complete');
				return result;
			} catch (error) {
				logger.debug({ extractor: name, err: error }, 'Extraction failed');
				return null;
			}
		},
	};
}

export function createProfileFieldExtractor<K extends keyof TutorProfile>(
	field: K,
	name: string,
	extractFn: (page: Page) => Promise<TutorProfile[K] | null>,
): ProfileFieldExtractor<K> {
	return {
		name,
		field,
		async extract(page: Page): Promise<TutorProfile[K] | null> {
			try {
				const result = await extractFn(page);
				logger.trace(
					{ extractor: name, field, hasResult: result !== null },
					'Field extraction complete',
				);
				return result;
			} catch (error) {
				logger.debug({ extractor: name, field, err: error }, 'Field extraction failed');
				return null;
			}
		},
	};
}
