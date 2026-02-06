import type { Page } from 'puppeteer';
import type { TutorProfile, ProfileFieldExtractor, PartialProfile } from '@/types';
import { logger } from '@/core/logger';

export async function runExtractors(
	page: Page,
	extractors: ProfileFieldExtractor<keyof TutorProfile>[],
	baseProfile: PartialProfile,
): Promise<TutorProfile> {
	const profile: PartialProfile = { ...baseProfile };

	for (const extractor of extractors) {
		const value = await extractor.extract(page);

		if (value !== null) {
			(profile as Record<string, unknown>)[extractor.field] = value;
		}
	}

	const completeProfile: TutorProfile = {
		id: profile.id,
		url: profile.url,
		name: profile.name || '',
		rating: profile.rating ?? null,
		reviewsCount: profile.reviewsCount ?? 0,
		pricePerHour: profile.pricePerHour ?? 0,
		shortDescription: profile.shortDescription ?? null,
		teachingLevels: profile.teachingLevels ?? [],
		education: profile.education ?? null,
		experience: profile.experience ?? null,
		ageRange: profile.ageRange ?? null,
		bio: profile.bio ?? null,
	};

	logger.debug(
		{
			profileId: completeProfile.id,
			fieldsExtracted: Object.keys(profile).length,
		},
		'Profile extraction complete',
	);

	return completeProfile;
}
