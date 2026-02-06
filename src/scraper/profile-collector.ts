import type { Page } from 'puppeteer';
import { createChildLogger } from '@/core/logger';
import { navigateAndWait } from './page-navigator';
import { delay } from '@/utils/delay';
import { writeJsonFile } from '@/utils/file';
import type { SiteAdapter, CrawlerConfig } from '@/types';

const collectorLogger = createChildLogger({ component: 'profile-collector' });

export interface CollectorOptions {
	adapter: SiteAdapter;
	config: CrawlerConfig;
	backupPath?: string;
}

export async function collectProfileUrls(page: Page, options: CollectorOptions): Promise<string[]> {
	const { adapter, config, backupPath } = options;
	const allUrls = new Set<string>();
	let currentPage = 1;
	let hasNextPage = true;

	const saveBackup = () => {
		if (backupPath && allUrls.size > 0) {
			const urls = Array.from(allUrls).map(p =>
				p.startsWith('http') ? p : `https://${adapter.domain}${p}`,
			);
			writeJsonFile(backupPath, urls);
			collectorLogger.info({ path: backupPath, count: urls.length }, 'URLs backup saved');
		}
	};

	try {
		while (hasNextPage) {
			const pageUrl = adapter.buildPageUrl(config.baseUrl, config.queryParams, currentPage);

			collectorLogger.info({ page: currentPage, url: pageUrl }, 'Fetching listing page');

			await navigateAndWait(page, pageUrl, 1000);

			const profileSelector = adapter.getProfileUrlSelector();
			const urlPattern = adapter.getProfileUrlPattern();

			const pageUrls = await page.$$eval(
				profileSelector,
				(links, patternStr, patternFlags) => {
					const pattern = new RegExp(patternStr, patternFlags);
					const urls = new Set<string>();

					links.forEach(link => {
						const href = link.getAttribute('href');
						if (href && pattern.test(href)) {
							urls.add(href);
						}
					});

					return Array.from(urls);
				},
				urlPattern.source,
				urlPattern.flags,
			);

			pageUrls.forEach(url => allUrls.add(url));

			collectorLogger.info(
				{ page: currentPage, found: pageUrls.length, total: allUrls.size },
				'Profiles found on page',
			);

			const checkNextPage = adapter.hasNextPage(currentPage);
			const nextPageExists = await checkNextPage(page);

			if (nextPageExists) {
				currentPage++;
				await delay(config.delayBetweenRequests);
			} else {
				hasNextPage = false;
			}
		}
	} catch (error) {
		saveBackup();
		throw error;
	}

	const fullUrls = Array.from(allUrls).map(path =>
		path.startsWith('http') ? path : `https://${adapter.domain}${path}`,
	);

	collectorLogger.info(
		{ totalUrls: fullUrls.length, pages: currentPage },
		'URL collection complete',
	);

	return fullUrls;
}

export async function collectProfileUrlsWithLimit(
	page: Page,
	options: CollectorOptions,
	maxUrls: number = 0,
): Promise<string[]> {
	const urls = await collectProfileUrls(page, options);

	if (maxUrls > 0 && urls.length > maxUrls) {
		collectorLogger.info({ total: urls.length, limit: maxUrls }, 'Limiting collected URLs');
		return urls.slice(0, maxUrls);
	}

	return urls;
}
