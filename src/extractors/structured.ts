import type { Page } from 'puppeteer';
import type { StructuredExtractorConfig, ListExtractorConfig, Extractor } from '@/types';
import { createExtractor } from './base';

// INFO: Extracts dt/dd pairs by matching label text
export function createStructuredExtractor(
	name: string,
	config: StructuredExtractorConfig,
): Extractor<string> {
	const { label, transform } = config;

	return createExtractor(name, async (page: Page) => {
		const value = await page.$$eval(
			'dt, dd',
			(elements, targetLabel) => {
				let currentTerm = '';

				for (const el of elements) {
					if (el.tagName === 'DT') {
						currentTerm = el.textContent?.trim().replace(/:$/, '') || '';
					} else if (el.tagName === 'DD' && currentTerm === targetLabel) {
						return el.textContent?.trim() || null;
					}
				}
				return null;
			},
			label,
		);

		if (!value) {
			return null;
		}

		return transform ? transform(value) : value;
	});
}

// INFO: Extracts list items filtered by keywords
export function createListExtractor(
	name: string,
	config: ListExtractorConfig,
): Extractor<string[]> {
	const { selector, keywords, maxLength = 100 } = config;

	return createExtractor(name, async (page: Page) => {
		const items = await page.$$eval(
			selector,
			(elements, kws, maxLen) => {
				const results: string[] = [];
				const seen = new Set<string>();

				elements.forEach(el => {
					const text = el.textContent?.trim() || '';

					if (
						text.length > 0 &&
						text.length <= maxLen &&
						kws.some(kw => text.toLowerCase().includes(kw.toLowerCase()))
					) {
						if (!seen.has(text)) {
							seen.add(text);
							results.push(text);
						}
					}
				});

				return results;
			},
			keywords,
			maxLength,
		);

		return items.length > 0 ? items : [];
	});
}

// INFO: Extracts content following a header element
export function createAfterHeaderExtractor(
	name: string,
	headerText: string,
	headerSelector: string = 'h2',
	contentSelector: string = 'p',
	minLength: number = 50,
): Extractor<string> {
	return createExtractor(name, async (page: Page) => {
		const content = await page.$$eval(
			`${headerSelector}, ${contentSelector}`,
			(elements, headerTxt, hSelector, cSelector, minLen) => {
				let foundHeader = false;

				for (const el of elements) {
					const text = el.textContent?.trim() || '';

					if (el.matches(hSelector) && text.includes(headerTxt)) {
						foundHeader = true;
						continue;
					}

					if (foundHeader && el.matches(cSelector) && text.length >= minLen) {
						return text;
					}
				}
				return null;
			},
			headerText,
			headerSelector,
			contentSelector,
			minLength,
		);

		return content;
	});
}
