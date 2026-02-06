export interface CrawlerConfig {
	baseUrl: string;
	queryParams: string;
	delayBetweenRequests: number;
	maxProfiles: number; // INFO: 0 - unlimited
	headless: boolean;
	backupDir?: string;
	outputDir: string;
}

export type UserConfig = Partial<CrawlerConfig>;

export interface BrowserConfig {
	headless: boolean;
	viewport: { width: number; height: number };
	userAgent: string;
	args: string[];
}

export interface NavigationOptions {
	timeout: number;
	waitUntil: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
}

export interface RetryConfig {
	retries: number;
	minTimeout: number;
	maxTimeout: number;
	factor: number;
}
