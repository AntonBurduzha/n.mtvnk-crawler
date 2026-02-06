import path from 'path';
import { createChildLogger } from '@/core/logger';
import { withBrowser } from '@/core/browser';
import { collectProfileUrlsWithLimit } from './profile-collector';
import { scrapeProfilesWithBackup } from './profile-scraper';
import { deleteFile } from '@/utils/file';
import type { SiteAdapter, CrawlerConfig, TutorProfile } from '@/types';

const orchestratorLogger = createChildLogger({ component: 'scraper' });

export interface ScraperOrchestratorOptions {
	adapter: SiteAdapter;
	config: CrawlerConfig;
}

export async function runScraper(options: ScraperOrchestratorOptions): Promise<TutorProfile[]> {
	const { adapter, config } = options;
	const urlsBackupPath = config.backupDir
		? path.join(config.backupDir, 'backup-urls.json')
		: undefined;
	const profilesBackupPath = config.backupDir
		? path.join(config.backupDir, 'backup-profiles.json')
		: undefined;

	orchestratorLogger.info(
		{
			adapter: adapter.name,
			baseUrl: config.baseUrl,
			maxProfiles: config.maxProfiles || 'unlimited',
		},
		'Starting scraper',
	);

	const profiles = await withBrowser(
		async (_, page) => {
			orchestratorLogger.info('Phase 1: Collecting profile URLs');

			const urls = await collectProfileUrlsWithLimit(
				page,
				{ adapter, config, backupPath: urlsBackupPath },
				config.maxProfiles,
			);

			if (urls.length === 0) {
				orchestratorLogger.warn('No profile URLs found');
				return [];
			}

			orchestratorLogger.info({ count: urls.length }, 'Profile URLs collected');

			if (urlsBackupPath) {
				deleteFile(urlsBackupPath);
			}

			orchestratorLogger.info('Phase 2: Scraping profiles');

			const scrapedProfiles = await scrapeProfilesWithBackup(page, urls, {
				adapter,
				config,
				backupPath: profilesBackupPath,
			});

			if (profilesBackupPath) {
				deleteFile(profilesBackupPath);
			}

			return scrapedProfiles;
		},
		{ headless: config.headless },
	);

	orchestratorLogger.info({ profilesScraped: profiles.length }, 'Scraping complete');

	return profiles;
}
