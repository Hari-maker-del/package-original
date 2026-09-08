const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api")).replace(/\/$/, "");
const TOKEN_KEY = "packsure_token";
const USER_KEY = "packsure_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch { return null; }
};
export const setSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!(options.body instanceof FormData) && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("Unable to reach PackSure API. Check that the backend is running.");
  }

  let data = null;
  try { data = await response.json(); } catch { /* empty/non-JSON response */ }
  if (response.status === 401 || response.status === 403) {
    clearSession();
    window.dispatchEvent(new Event("packsure-auth-expired"));
  }
  if (!response.ok) throw new Error(data?.message || data?.detail || `Request failed (${response.status})`);
  return data;
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  inspections: () => request("/inspections"),
  inspection: (id) => request(`/inspections/${encodeURIComponent(id)}`),
  createInspection: (file) => {
    const form = new FormData();
    form.append("image", file);
    return request("/inspections/analyze", { method: "POST", body: form });
  },
  verifyQr: (value) => request("/qr/verify", { method: "POST", body: JSON.stringify({ value }) }),
  reportUrl: (id, format = "html") => `${API_BASE_URL}/inspections/${encodeURIComponent(id)}/report?format=${encodeURIComponent(format)}`,
};

export { API_BASE_URL };
