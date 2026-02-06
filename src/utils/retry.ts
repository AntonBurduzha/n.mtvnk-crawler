import pRetry, { Options as PRetryOptions } from 'p-retry';
import { logger } from '@/core/logger';
import type { RetryConfig } from '@/types';
import { DEFAULT_RETRY_CONFIG } from '@/config/defaults';

export async function withRetry<T>(
	fn: () => Promise<T>,
	options: Partial<RetryConfig> & { context?: string } = {},
): Promise<T> {
	const config = { ...DEFAULT_RETRY_CONFIG, ...options };

	const pRetryOptions: PRetryOptions = {
		retries: config.retries,
		minTimeout: config.minTimeout,
		maxTimeout: config.maxTimeout,
		factor: config.factor,
		onFailedAttempt: error => {
			const remaining = error.retriesLeft;
			const attempt = config.retries - remaining;

			logger.warn(
				{
					attempt,
					retriesLeft: remaining,
					context: options.context,
					error: error.message,
				},
				`Retry attempt ${attempt}/${config.retries}`,
			);
		},
	};

	return pRetry(fn, pRetryOptions);
}
