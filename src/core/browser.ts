import puppeteer, { Browser, Page } from 'puppeteer';
import { BrowserError } from './errors';
import { logger } from './logger';
import type { BrowserConfig } from '@/types';
import { DEFAULT_BROWSER_CONFIG } from '@/config/defaults';

export async function createBrowser(config: Partial<BrowserConfig> = {}): Promise<Browser> {
	const finalConfig = { ...DEFAULT_BROWSER_CONFIG, ...config };
	logger.debug({ config: finalConfig }, 'Launching browser');

	try {
		const browser = await puppeteer.launch({
			headless: finalConfig.headless,
			args: finalConfig.args,
		});

		logger.info('Browser launched successfully');
		return browser;
	} catch (error) {
		throw new BrowserError(
			'Failed to launch browser',
			{ config: finalConfig },
			error instanceof Error ? error : undefined,
		);
	}
}

export async function createPage(
	browser: Browser,
	config: Partial<BrowserConfig> = {},
): Promise<Page> {
	const finalConfig = { ...DEFAULT_BROWSER_CONFIG, ...config };

	try {
		const page = await browser.newPage();
		await page.setViewport(finalConfig.viewport);
		await page.setUserAgent(finalConfig.userAgent);

		logger.debug(
			{
				viewport: finalConfig.viewport,
				userAgent: finalConfig.userAgent.slice(0, 50) + '...',
			},
			'Page created and configured',
		);

		return page;
	} catch (error) {
		throw new BrowserError(
			'Failed to create page',
			{ viewport: finalConfig.viewport },
			error instanceof Error ? error : undefined,
		);
	}
}

export async function closeBrowser(browser: Browser): Promise<void> {
	try {
		await browser.close();
		logger.info('Browser closed');
	} catch (error) {
		logger.warn({ err: error }, 'Error closing browser');
	}
}

export async function withBrowser<T>(
	fn: (browser: Browser, page: Page) => Promise<T>,
	config: Partial<BrowserConfig> = {},
): Promise<T> {
	const browser = await createBrowser(config);

	try {
		const page = await createPage(browser, config);
		return await fn(browser, page);
	} finally {
		await closeBrowser(browser);
	}
}

export type { Browser, Page };
