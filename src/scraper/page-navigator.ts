import type { Page } from 'puppeteer';
import { NavigationError } from '@/core/errors';
import { logger } from '@/core/logger';
import { withRetry } from '@/utils/retry';
import { delay } from '@/utils/delay';
import type { NavigationOptions, RetryConfig } from '@/types';
import { DEFAULT_NAVIGATION_OPTIONS, DEFAULT_RETRY_CONFIG } from '@/config/defaults';

export async function navigateWithRetry(
	page: Page,
	url: string,
	options: Partial<NavigationOptions & RetryConfig> = {},
): Promise<void> {
	const navOptions = { ...DEFAULT_NAVIGATION_OPTIONS, ...options };
	const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...options };

	logger.debug({ url, timeout: navOptions.timeout }, 'Navigating to URL');

	try {
		await withRetry(
			async () => {
				await page.goto(url, {
					waitUntil: navOptions.waitUntil,
					timeout: navOptions.timeout,
				});
			},
			{ ...retryConfig, context: `navigate:${url}` },
		);

		logger.debug({ url }, 'Navigation successful');
	} catch (error) {
		throw new NavigationError(
			url,
			`Failed to navigate after ${retryConfig.retries} retries`,
			error instanceof Error ? error : undefined,
		);
	}
}

export async function navigateAndWait(
	page: Page,
	url: string,
	additionalWait: number = 500,
	options: Partial<NavigationOptions & RetryConfig> = {},
): Promise<void> {
	await navigateWithRetry(page, url, options);

	if (additionalWait > 0) {
		await delay(additionalWait);
	}
}
