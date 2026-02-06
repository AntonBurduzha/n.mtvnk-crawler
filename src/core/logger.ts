import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = pino({
	level: process.env.LOG_LEVEL || 'info',
	transport: isDevelopment
		? {
				target: 'pino-pretty',
				options: {
					colorize: true,
					translateTime: 'SYS:standard',
					ignore: 'pid,hostname',
				},
			}
		: undefined,
	base: {
		app: 'buki-crawler',
	},
});

export function createChildLogger(bindings: Record<string, unknown>) {
	return logger.child(bindings);
}

export type Logger = typeof logger;
