import { z } from 'zod';

export const crawlerConfigSchema = z.object({
	baseUrl: z
		.string()
		.url('baseUrl must be a valid URL')
		.refine(url => url.startsWith('https://'), 'baseUrl must use HTTPS'),
	queryParams: z
		.string()
		.default('')
		.refine(
			params => params === '' || params.startsWith('?'),
			'queryParams must start with ? or be empty',
		),
	delayBetweenRequests: z
		.number()
		.int()
		.min(500, 'Delay must be at least 500ms to avoid rate limiting')
		.max(30000, 'Delay should not exceed 30 seconds')
		.default(2000),
	maxProfiles: z
		.number()
		.int()
		.min(0, 'maxProfiles must be non-negative')
		.default(0)
		.describe('0 means unlimited'),
	headless: z.boolean().default(true),
	backupDir: z.string().optional(),
	outputDir: z.string().default('output'),
});

export const browserConfigSchema = z.object({
	headless: z.boolean().default(true),
	viewport: z
		.object({
			width: z.number().int().min(800).max(3840).default(1280),
			height: z.number().int().min(600).max(2160).default(800),
		})
		.default({}),
	userAgent: z
		.string()
		.default(
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		),
	args: z.array(z.string()).default(['--no-sandbox', '--disable-setuid-sandbox']),
});

export const retryConfigSchema = z.object({
	retries: z.number().int().min(0).max(10).default(3),
	minTimeout: z.number().int().min(100).max(10000).default(1000),
	maxTimeout: z.number().int().min(1000).max(60000).default(10000),
	factor: z.number().min(1).max(5).default(2),
});

export const navigationOptionsSchema = z.object({
	timeout: z.number().int().min(5000).max(120000).default(30000),
	waitUntil: z
		.enum(['load', 'domcontentloaded', 'networkidle0', 'networkidle2'])
		.default('networkidle0'),
});
