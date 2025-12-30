const API_BASE_URL = "http://localhost:8080/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    ...Object.fromEntries(new Headers(options.headers).entries()),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // --- CORRECTION MAJEURE ICI ---
  // On récupère le texte brut une seule fois
  const rawText = await response.text();
  
  // On essaie de parser le JSON si le texte n'est pas vide
  let data: any = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch (e) {
    data = rawText; // Si ce n'est pas du JSON, on garde le texte brut
  }

  if (!response.ok) {
    // Si la réponse est une erreur, on utilise les données déjà extraites
    const errorMessage = data?.error || data?.message || (typeof data === 'string' ? data : response.statusText);
    throw new ApiError(response.status, errorMessage);
  }

  if (response.status === 204 || !data) {
    return {} as T;
  }

  return data as T;
}