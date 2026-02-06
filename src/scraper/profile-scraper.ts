import type { Page } from 'puppeteer';
import { createChildLogger } from '@/core/logger';
import { navigateAndWait } from './page-navigator';
import { runExtractors } from '@/extractors';
import { delay } from '@/utils/delay';
import { writeJsonFile } from '@/utils/file';
import type { SiteAdapter, TutorProfile, CrawlerConfig } from '@/types';

const scraperLogger = createChildLogger({ component: 'profile-scraper' });

export interface ScraperOptions {
	adapter: SiteAdapter;
	config: CrawlerConfig;
	backupPath?: string;
}

export async function scrapeProfile(
	page: Page,
	url: string,
	adapter: SiteAdapter,
): Promise<TutorProfile | null> {
	try {
		await navigateAndWait(page, url, 500);

		const id = adapter.extractId(url);
		const extractors = adapter.getProfileExtractors();

		const profile = await runExtractors(page, extractors, { id, url });

		scraperLogger.debug({ id, name: profile.name }, 'Profile scraped');

		return profile;
	} catch (error) {
		scraperLogger.warn({ url, err: error }, 'Failed to scrape profile');
		return null;
	}
}

export async function scrapeProfilesWithBackup(
	page: Page,
	urls: string[],
	options: ScraperOptions,
	backupInterval: number = 10,
): Promise<TutorProfile[]> {
	const { adapter, config, backupPath } = options;
	const profiles: TutorProfile[] = [];

	const saveBackup = () => {
		if (backupPath && profiles.length > 0) {
			writeJsonFile(backupPath, profiles);
			scraperLogger.debug({ count: profiles.length }, 'Incremental backup saved');
		}
	};

	try {
		for (let i = 0; i < urls.length; i++) {
			const url = urls[i];

			scraperLogger.info({ progress: `[${i + 1}/${urls.length}]`, url }, 'Scraping profile');

			const profile = await scrapeProfile(page, url, adapter);

			if (profile) {
				profiles.push(profile);

				if (backupPath && profiles.length % backupInterval === 0) {
					saveBackup();
				}
			}

			if (i < urls.length - 1) {
				await delay(config.delayBetweenRequests);
			}
		}
	} catch (error) {
		saveBackup();
		throw error;
	}

	return profiles;
}
