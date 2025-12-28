const API_BASE_URL = "http://localhost:8080/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // 1. Récupération sécurisée du token 
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

 //  On définit les headers comme un objet simple indexable
  const headers: Record<string, string> = {
    ...Object.fromEntries(new Headers(options.headers).entries()),
  };

  // 2. On ajoute le Content-Type si ce n'est pas du FormData (images)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // 3. On ajoute l'Authorization (plus d'erreur TypeScript ici)
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers, // TypeScript accepte Record<string, string> ici car il est compatible avec HeadersInit
  });

  // 5. Gestion des erreurs centralisée
  if (!response.ok) {
    let errorMessage = "Une erreur est survenue";
    try {
      // On essaie de lire le message d'erreur envoyé par  backend 
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
    } catch {
      errorMessage = await response.text() || response.statusText;
    }
    throw new ApiError(response.status, errorMessage);
  }

  // 6. Gestion des réponses vides (No Content 204)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}