export class CrawlerError extends Error {
	readonly code: string;

	readonly context: Record<string, unknown>;

	readonly recoverable: boolean;

	constructor(
		message: string,
		options: {
			code: string;
			context?: Record<string, unknown>;
			recoverable?: boolean;
			cause?: Error;
		},
	) {
		super(message, { cause: options.cause });
		this.name = 'CrawlerError';
		this.code = options.code;
		this.context = options.context || {};
		this.recoverable = options.recoverable ?? false;
	}

	toJSON() {
		return {
			name: this.name,
			code: this.code,
			message: this.message,
			context: this.context,
			recoverable: this.recoverable,
			stack: this.stack,
		};
	}
}

export class BrowserError extends CrawlerError {
	constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
		super(message, {
			code: 'BROWSER_ERROR',
			context,
			recoverable: false,
			cause,
		});
		this.name = 'BrowserError';
	}
}

export class NavigationError extends CrawlerError {
	readonly url: string;

	constructor(url: string, message: string, cause?: Error) {
		super(message, {
			code: 'NAVIGATION_ERROR',
			context: { url },
			recoverable: true,
			cause,
		});
		this.name = 'NavigationError';
		this.url = url;
	}
}

export class ExtractionError extends CrawlerError {
	readonly extractorName: string;
	readonly selector?: string;

	constructor(
		extractorName: string,
		message: string,
		options?: { selector?: string; cause?: Error },
	) {
		super(message, {
			code: 'EXTRACTION_ERROR',
			context: { extractorName, selector: options?.selector },
			recoverable: true,
			cause: options?.cause,
		});
		this.name = 'ExtractionError';
		this.extractorName = extractorName;
		this.selector = options?.selector;
	}
}

export class ConfigurationError extends CrawlerError {
	constructor(message: string, context?: Record<string, unknown>) {
		super(message, {
			code: 'CONFIGURATION_ERROR',
			context,
			recoverable: false,
		});
		this.name = 'ConfigurationError';
	}
}

export class ExportError extends CrawlerError {
	readonly outputPath: string;

	constructor(outputPath: string, message: string, cause?: Error) {
		super(message, {
			code: 'EXPORT_ERROR',
			context: { outputPath },
			recoverable: false,
			cause,
		});
		this.name = 'ExportError';
		this.outputPath = outputPath;
	}
}
