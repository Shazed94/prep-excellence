import type { Prisma } from "@/generated/client";

export function buildTypeSafeWhere<T extends Record<string, any>>(
	whereInput: T,
): T {
	return whereInput;
}

export function castFilterValue(value: string | undefined): any {
	if (value === undefined) return undefined;
	if (value === "true") return true;
	if (value === "false") return false;
	if (value === "null") return null;

	const num = Number(value);
	if (!Number.isNaN(num)) return num;

	return value;
}

export function parseQueryFilters<T extends Record<string, any>>(
	queryFilters: Record<string, string> | undefined,
	allowedFields: Array<keyof T>,
): Partial<T> {
	const where: Partial<T> = {};

	if (!queryFilters) return where;

	for (const [key, value] of Object.entries(queryFilters)) {
		if (allowedFields.includes(key as keyof T)) {
			(where as any)[key] = castFilterValue(value);
		}
	}

	return where;
}

export function parseQuerySearch<T extends Record<string, any>>(
	searchTerm?: string,
	searchFields?: Array<keyof T>,
): Partial<T> {
	if (!searchTerm || !searchFields?.length) {
		return {};
	}

	return {
		OR: searchFields.map((field) => ({
			[field]: {
				contains: searchTerm,
				mode: "insensitive" as const,
			},
		})),
	} as unknown as Partial<T>;
}

export function buildFiltersWithSearch<T extends Record<string, any>>(
	queryFilters: Record<string, string> | undefined,
	allowedFilterFields: Array<keyof T>,
	searchTerm?: string,
	searchFields?: Array<keyof T>,
): T {
	const parsedFilters = parseQueryFilters<T>(queryFilters, allowedFilterFields);

	const mergedWhere = {
		...parsedFilters,
	} as T;

	if (searchTerm && searchFields && searchFields.length > 0) {
		const orConditions = searchFields.map((field) => ({
			[field]: {
				contains: searchTerm,
				mode: "insensitive" as const,
			},
		}));

		(mergedWhere as any).OR = orConditions;
	}

	return mergedWhere;
}

export function buildCompleteWhere<T extends Record<string, any>>(
	baseWhere: Partial<T>,
	queryFilters: Record<string, string> | undefined,
	allowedFilterFields: Array<keyof T>,
	searchTerm?: string,
	searchFields?: Array<keyof T>,
): T {
	const parsedFilters = parseQueryFilters<T>(queryFilters, allowedFilterFields);

	const mergedWhere = {
		...baseWhere,
		...parsedFilters,
	} as T;

	if (searchTerm && searchFields && searchFields.length > 0) {
		const orConditions = searchFields.map((field) => ({
			[field]: {
				contains: searchTerm,
				mode: "insensitive" as const,
			},
		}));

		(mergedWhere as any).OR = orConditions;
	}

	return mergedWhere;
}

export function buildOrderBy<T extends Record<string, any>>(
	sortBy: keyof T,
	orderBy: "asc" | "desc",
): T {
	return { [sortBy]: orderBy } as T;
}

export type LMSModuleFilters = Prisma.LMSModuleWhereInput;
export type LMSCourseFilters = Prisma.LMSCourseWhereInput;
export type LMSLessonFilters = Prisma.LMSLessonWhereInput;
export type CoachingCourseFilters = Prisma.CoachingCourseWhereInput;
export type CoachingModuleFilters = Prisma.CoachingModuleWhereInput;
export type UserFilters = Prisma.UserWhereInput;
export type StudentFilters = Prisma.StudentWhereInput;
export type TeacherFilters = Prisma.TeacherWhereInput;
