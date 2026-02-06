import type { ExcelColumn } from '@/types';

export const TUTOR_COLUMNS: ExcelColumn[] = [
	{
		key: 'id',
		header: 'ID',
		width: 10,
	},
	{
		key: 'url',
		header: 'Profile URL',
		width: 40,
	},
	{
		key: 'name',
		header: 'Name',
		width: 25,
	},
	{
		key: 'rating',
		header: 'Rating',
		width: 10,
	},
	{
		key: 'reviewsCount',
		header: 'Reviews Count',
		width: 15,
	},
	{
		key: 'pricePerHour',
		header: 'Price (UAH/hour)',
		width: 18,
	},
	{
		key: 'shortDescription',
		header: 'Short Description',
		width: 50,
	},
	{
		key: 'teachingLevels',
		header: 'Teaching Levels',
		width: 40,
	},
	{
		key: 'education',
		header: 'Education',
		width: 40,
	},
	{
		key: 'experience',
		header: 'Experience',
		width: 20,
	},
	{
		key: 'ageRange',
		header: 'Age Range',
		width: 12,
	},
	{
		key: 'bio',
		header: 'Full Bio',
		width: 80,
	},
];
