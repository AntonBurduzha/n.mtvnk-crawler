import { ZodError } from 'zod';
import { ConfigurationError } from '@/core/errors';
import { logger } from '@/core/logger';
import type { CrawlerConfig, UserConfig } from '@/types';
import { DEFAULT_CRAWLER_CONFIG } from './defaults';
import { crawlerConfigSchema } from './schema';

export function loadConfig(userConfig: UserConfig = {}): CrawlerConfig {
	const merged = { ...DEFAULT_CRAWLER_CONFIG, ...userConfig };
	try {
		const validated = crawlerConfigSchema.parse(merged);

		logger.debug({ config: validated }, 'Configuration loaded');
		return validated;
	} catch (error) {
		if (error instanceof ZodError) {
			const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`);
			throw new ConfigurationError(`Invalid configuration: ${issues.join('; ')}`, {
				issues: error.issues,
			});
		}
		throw error;
	}
}
