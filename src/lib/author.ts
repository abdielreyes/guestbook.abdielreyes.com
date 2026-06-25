// Builds the `author` string shown on a signature:
//   <ip> · <city, country> · <user agent>
//
// The browser can't read its own public IP, so geolocation is fetched from
// ipwho.is (HTTPS, no API key). This runs client-side, so the value is
// best-effort and not tamper-proof. If the lookup fails or times out, the
// author falls back to the user agent alone.
export async function buildAuthor(): Promise<string> {
	const userAgent = navigator.userAgent;

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 4000);

	try {
		const res = await fetch('https://ipwho.is/', { signal: controller.signal });

		if (res.ok) {
			const data = await res.json();

			if (data?.success) {
				const location = [data.city, data.country].filter(Boolean).join(', ');
				return `${data.ip} · ${location || 'unknown'} · ${userAgent}`;
			}
		}
	} catch {
		// Network error or timeout — fall through to user agent only.
	} finally {
		clearTimeout(timeout);
	}

	return userAgent;
}
