import path from 'path';
import { logger } from '@/core/logger';
import { loadConfig } from '@/config';
import { runScraper } from '@/scraper';
import { exportToExcel } from '@/exporters';
import { ensureOutputDir, generateOutputFilename } from '@/utils/file';
import { bukiAdapter } from '@/sites/buki';
import type { UserConfig } from '@/types';

async function main(userConfig: UserConfig = {}): Promise<void> {
	logger.info('Starting Buki Crawler');

	const config = loadConfig({
		delayBetweenRequests: 2000,
		maxProfiles: 5, // INFO: For testing - set to 0 for unlimited
		// headless: false, // INFO: Uncomment to see browser
		...userConfig,
	});

	const outputDir = ensureOutputDir(config.outputDir);
	const outputFilename = generateOutputFilename();
	const outputPath = path.join(outputDir, outputFilename);

	config.backupDir = outputDir;

	logger.info(
		{
			baseUrl: config.baseUrl,
			maxProfiles: config.maxProfiles || 'unlimited',
			outputPath,
		},
		'Configuration loaded',
	);

	const profiles = await runScraper({ adapter: bukiAdapter, config });

	if (profiles.length === 0) {
		logger.error('No profiles were scraped. Check the website structure.');
		process.exit(1);
	}
	logger.info({ count: profiles.length }, 'Profiles scraped');

	await exportToExcel(profiles, outputPath);

	logger.info({ outputPath }, 'Export complete');
}

main().catch(error => {
	logger.error({ err: error }, 'Crawler failed');
	process.exit(1);
});
