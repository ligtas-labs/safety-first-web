function storageKey(userId: string, classId = "") {
	return `safety-first:class-code:${userId}:${classId}`;
}

export function rememberClassCode(
	userId: string,
	classId: string,
	code: string,
	expiresAt: string,
) {
	try {
		sessionStorage.setItem(
			storageKey(userId, classId),
			JSON.stringify({ code, expiresAt }),
		);
	} catch {
		// The class card can still show the new code in memory.
	}
}

export function readClassCode(
	userId: string,
	classId: string,
): string | undefined {
	try {
		const stored = sessionStorage.getItem(storageKey(userId, classId));
		if (!stored) return;
		const { code, expiresAt } = JSON.parse(stored);
		if (
			typeof code === "string" &&
			typeof expiresAt === "string" &&
			Date.parse(expiresAt) > Date.now()
		)
			return code;
	} catch {
		// Expired or unavailable browser storage leaves code generation available.
	}
}

export function clearClassCodes(userId: string) {
	try {
		for (let i = sessionStorage.length - 1; i >= 0; i--) {
			const key = sessionStorage.key(i);
			if (key?.startsWith(storageKey(userId))) sessionStorage.removeItem(key);
		}
	} catch {
		// Storage may be unavailable in a restricted browser.
	}
}
