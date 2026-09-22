"use client";

import { useEffect, useState } from "react";
import { useToken } from "@/lib/useToken";

export function useRelKey() {
	const { token, hasToken } = useToken();
	const [relKey, setRelKey] = useState<string | null>(null);

	useEffect(() => {
		if (!hasToken || !token) {
			setRelKey(null);
			return;
		}

		fetch(`/api/py/user/checkExpiration?token=${encodeURIComponent(token)}`)
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => setRelKey(data?.rel_key ?? null))
			.catch(() => setRelKey(null));
	}, [hasToken, token]);

	return relKey;
}
