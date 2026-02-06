import ExcelJS from 'exceljs';
import { createChildLogger } from '@/core/logger';
import { ExportError } from '@/core/errors';
import type { TutorProfile, ExcelColumn } from '@/types';
import { TUTOR_COLUMNS } from './columns';

const exportLogger = createChildLogger({ component: 'excel-exporter' });

export interface ExportOptions {
	columns?: ExcelColumn[];
	sheetName?: string;
	creator?: string;
}

export async function exportToExcel(
	profiles: TutorProfile[],
	outputPath: string,
	options: ExportOptions = {},
): Promise<void> {
	const { columns = TUTOR_COLUMNS, sheetName = 'Tutors', creator = 'Buki Crawler' } = options;

	exportLogger.info({ outputPath, profileCount: profiles.length }, 'Starting Excel export');

	try {
		const workbook = new ExcelJS.Workbook();
		workbook.creator = creator;
		workbook.created = new Date();

		const worksheet = workbook.addWorksheet(sheetName);
		worksheet.columns = columns.map(col => col);
		profiles.forEach(profile => {
			const rowData = { ...profile, teachingLevels: profile.teachingLevels.join(', ') };
			worksheet.addRow(rowData);
		});
		await workbook.xlsx.writeFile(outputPath);

		exportLogger.info({ outputPath }, 'Excel export complete');
	} catch (error) {
		throw new ExportError(
			outputPath,
			'Failed to export to Excel',
			error instanceof Error ? error : undefined,
		);
	}
}
