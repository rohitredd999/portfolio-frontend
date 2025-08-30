const BASE = import.meta.env.VITE_API_URL;

export async function fetchProjects() {
  const res = await fetch(`${BASE}/api/projects`);
  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
  return res.json();
}
