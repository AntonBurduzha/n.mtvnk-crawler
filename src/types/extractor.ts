import type { Page } from 'puppeteer';
import type { TutorProfile } from './profile';

export interface Extractor<T = unknown> {
	name: string;
	extract(page: Page): Promise<T | null>;
}

export interface ProfileFieldExtractor<K extends keyof TutorProfile> extends Extractor<
	TutorProfile[K]
> {
	field: K;
}

export interface TextExtractorConfig {
	selector: string;
	transform?: (text: string) => string;
	removeSelectors?: string[];
}

export interface PatternExtractorConfig {
	selector: string;
	pattern: RegExp;
	captureGroup?: number;
	transform?: (captured: string) => string | number | null;
}

export interface StructuredExtractorConfig {
	label: string;
	transform?: (value: string) => string;
}

export interface ListExtractorConfig {
	selector: string;
	keywords: string[];
	maxLength?: number;
}

export interface SiteAdapter {
	name: string;
	domain: string;
	getProfileUrlSelector(): string;
	getProfileUrlPattern(): RegExp;
	getProfileExtractors(): ProfileFieldExtractor<keyof TutorProfile>[];
	hasNextPage(currentPage: number): (page: Page) => Promise<boolean>;
	buildPageUrl(baseUrl: string, queryParams: string, pageNumber: number): string;
	extractId(url: string): string;
}
