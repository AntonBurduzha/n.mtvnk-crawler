import fs from 'fs';
import path from 'path';
import { logger } from '@/core/logger';

export function ensureDir(dirPath: string): string {
	const resolved = path.resolve(dirPath);
	if (!fs.existsSync(resolved)) {
		fs.mkdirSync(resolved, { recursive: true });
		logger.debug({ path: resolved }, 'Created directory');
	}

	return resolved;
}

export function ensureOutputDir(outputDir: string = 'output'): string {
	const outputPath = path.join(process.cwd(), outputDir);
	return ensureDir(outputPath);
}

export function generateOutputFilename(
	prefix: string = 'tutors',
	extension: string = 'xlsx',
): string {
	const now = new Date();
	const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
	return `${prefix}-${timestamp}.${extension}`;
}

export function writeJsonFile(filePath: string, data: unknown): void {
	const tempPath = `${filePath}.tmp`;
	const content = JSON.stringify(data, null, 2);

	fs.writeFileSync(tempPath, content, 'utf-8');
	fs.renameSync(tempPath, filePath);

	logger.debug({ path: filePath }, 'Wrote JSON file');
}

export function deleteFile(filePath: string): boolean {
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
		logger.debug({ path: filePath }, 'Deleted file');
		return true;
	}
	return false;
}
