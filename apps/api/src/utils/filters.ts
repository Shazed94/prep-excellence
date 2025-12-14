export const castFilterValue = (v: string) => {
	if (v === "true") return true;
	if (v === "false") return false;
	const n = Number(v);
	return Number.isNaN(n) ? v : n;
};

export const buildWhere = (
	filters: Record<string, string> | undefined,
	allowedFields: string[],
) => {
	const where: Record<string, any> = {};
	if (!filters) return where;

	for (const [key, value] of Object.entries(filters)) {
		if (!allowedFields.includes(key)) continue;
		where[key] = castFilterValue(value);
	}
	return where;
};
