import { createAuthClient } from "@neon/auth";
import { BetterAuthReactAdapter } from "@neon/auth/react/adapters";

const url = import.meta.env.VITE_NEON_AUTH_URL;
export const auth = url
	? createAuthClient(url, { adapter: BetterAuthReactAdapter() })
	: undefined;

export class ApiError extends Error {
	readonly status: number;
	constructor(status: number) {
		super(
			status === 401
				? "Please sign in again."
				: status === 403
					? "You do not have access to this action."
					: status === 409
						? "Your account already has a different membership or this request has changed."
						: status === 400
							? "Check your details or code and try again."
							: "The service is unavailable. Try again.",
		);
		this.status = status;
	}
}

export async function api<T>(
	path: string,
	method = "GET",
	body?: unknown,
): Promise<T> {
	const token = await auth?.$fetch<{ token: string }>("/token");
	if (!token?.data?.token) throw new ApiError(401);
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL ?? ""}/api/${path}`,
		{
			method,
			headers: {
				Authorization: `Bearer ${token.data.token}`,
				...(body ? { "Content-Type": "application/json" } : {}),
			},
			body: body ? JSON.stringify(body) : undefined,
			cache: "no-store",
		},
	);
	if (!response.ok) throw new ApiError(response.status);
	const text = await response.text();
	return (text ? JSON.parse(text) : undefined) as T;
}

export function navigateOAuth(value: string) {
	const next = new URL(value);
	const neonOrigin = new URL(import.meta.env.VITE_NEON_AUTH_URL).origin;
	if (
		next.protocol !== "https:" ||
		(next.origin !== location.origin && next.origin !== neonOrigin)
	)
		throw new Error("Unexpected authorization return address.");
	location.assign(next.toString());
}
