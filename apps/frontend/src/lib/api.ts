import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

interface CreateShortenRequest {
  url: string;
  expires_in_days?: number | null;
}

interface CreateShortenResponse {
  short_url: string;
  expires_at: string | null;
}

interface ShortenEntry {
  short_code: string;
  long_url: string;
  created_at: string;
  expires_at: string | null;
  click_count: number;
  last_accessed_at: string | null;
}

export async function createShorten(
  data: CreateShortenRequest,
): Promise<CreateShortenResponse> {
  const res = await api.post<CreateShortenResponse>("/shorten", data);
  return res.data;
}

export async function listShortCodes(): Promise<{ urls: ShortenEntry[] }> {
  const res = await api.get<{ urls: ShortenEntry[] }>("/short-codes");
  return res.data;
}

export type { CreateShortenResponse, ShortenEntry };
