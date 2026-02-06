import type { Page } from 'puppeteer';
import type { TextExtractorConfig } from '@/types';
import { createExtractor } from './base';
import type { Extractor } from '@/types';

export function createTextExtractor(name: string, config: TextExtractorConfig): Extractor<string> {
	const { selector, transform, removeSelectors } = config;

	return createExtractor(name, async (page: Page) => {
		const text = await page.$eval(
			selector,
			(el, selectorsToRemove) => {
				const clone = el.cloneNode(true) as HTMLElement;
				if (selectorsToRemove && selectorsToRemove.length > 0) {
					selectorsToRemove.forEach(sel => {
						clone.querySelectorAll(sel).forEach(child => child.remove());
					});
				}
				return clone.textContent?.trim() || '';
			},
			removeSelectors || [],
		);
		if (!text) {
			return null;
		}

		return transform ? transform(text) : text;
	});
}
