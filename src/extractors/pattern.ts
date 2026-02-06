import type { Page } from 'puppeteer';
import type { PatternExtractorConfig, Extractor } from '@/types';
import { createExtractor } from './base';

export function createPatternExtractor<T = string>(
	name: string,
	config: PatternExtractorConfig & { transform?: (captured: string) => T },
): Extractor<T> {
	const { selector, pattern, captureGroup = 1, transform } = config;

	return createExtractor(name, async (page: Page) => {
		const result = await page.$$eval(
			selector,
			(elements, patternStr, patternFlags, group) => {
				const regex = new RegExp(patternStr, patternFlags);

				for (const el of elements) {
					const text = el.textContent?.trim() || '';
					const match = text.match(regex);
					if (match && match[group]) {
						return match[group];
					}
				}
				return null;
			},
			pattern.source,
			pattern.flags,
			captureGroup,
		);

		if (result === null) {
			return null;
		}

		return (transform ? transform(result) : result) as T;
	});
}

export function createNumericPatternExtractor(
	name: string,
	selector: string,
	pattern: RegExp,
): Extractor<number> {
	return createPatternExtractor(name, {
		selector,
		pattern,
		transform: captured => parseInt(captured, 10),
	});
}

export function createBoundedNumericExtractor(
	name: string,
	selector: string,
	pattern: RegExp,
	min: number,
	max: number,
): Extractor<number> {
	return createExtractor(name, async (page: Page) => {
		const result = await page.$$eval(
			selector,
			(elements, patternStr, patternFlags, minVal, maxVal) => {
				const regex = new RegExp(patternStr, patternFlags);

				for (const el of elements) {
					const text = el.textContent?.trim() || '';
					const match = text.match(regex);
					if (match && match[1]) {
						const num = parseFloat(match[1]);
						if (num >= minVal && num <= maxVal) {
							return num;
						}
					}
				}
				return null;
			},
			pattern.source,
			pattern.flags,
			min,
			max,
		);

		return result;
	});
}
