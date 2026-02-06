import type { CrawlerConfig, BrowserConfig, RetryConfig, NavigationOptions } from '@/types';

export const DEFAULT_CRAWLER_CONFIG: CrawlerConfig = {
	baseUrl: 'https://buki.com.ua/tutors-online/frantsuzka-mova/c1-c2/',
	queryParams: '?rate_to=700&sort=rate_asc',
	delayBetweenRequests: 2000,
	maxProfiles: 0,
	headless: true,
	outputDir: 'output',
};

export const DEFAULT_BROWSER_CONFIG: BrowserConfig = {
	headless: true,
	viewport: { width: 1280, height: 800 },
	userAgent:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
	args: ['--no-sandbox', '--disable-setuid-sandbox'],
};

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
	retries: 3,
	minTimeout: 1000,
	maxTimeout: 10000,
	factor: 2,
};

export const DEFAULT_NAVIGATION_OPTIONS: NavigationOptions = {
	timeout: 30000,
	waitUntil: 'networkidle0',
};
