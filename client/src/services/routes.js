// Normalize VITE_API_URL and default to a relative /api when not set.
const rawApi = import.meta.env.VITE_API_URL || "";
const normalized = rawApi.replace(/\/+$/, ''); // remove trailing slashes
// If an absolute API host is provided, use it with the /api prefix. Otherwise use relative /api.
export const API_URL = normalized ? `${normalized}/api` : "/api";

export async function getExampleData() {
  const res = await fetch(`${API_URL}/example`);
  return res.json();
}
