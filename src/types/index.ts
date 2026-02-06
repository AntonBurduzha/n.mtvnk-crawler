export * from './profile';
export * from './config';
export * from './extractor';

export interface ExcelColumn {
	key: keyof import('./profile').TutorProfile;
	header: string;
	width: number;
}
