export interface TutorProfile {
	id: string;
	url: string;
	name: string;
	rating: number | null;
	reviewsCount: number;
	pricePerHour: number;
	shortDescription: string | null;
	teachingLevels: string[];
	education: string | null;
	experience: string | null;
	ageRange: string | null;
	bio: string | null;
}

export type PartialProfile = Partial<TutorProfile> & { id: string; url: string };
