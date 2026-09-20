import { REQUEST_TIMEOUT_MS } from '../constants';
import type { PicsumImage } from '../types/gallery';

const PICSUM_LIST_URL = 'https://picsum.photos/v2/list';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const isPicsumImage = (value: unknown): value is PicsumImage => {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.author === 'string' &&
    typeof item.width === 'number' &&
    typeof item.height === 'number' &&
    typeof item.url === 'string' &&
    typeof item.download_url === 'string'
  );
};

/** Fetches one page of images. Throws ApiError with a user-friendly message on failure. */
export async function fetchImagePage(page: number, limit: number): Promise<PicsumImage[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${PICSUM_LIST_URL}?page=${page}&limit=${limit}`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new ApiError(`The server responded with an error (${response.status}).`);
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      throw new ApiError('Received an unexpected response from the server.');
    }
    return data.filter(isPicsumImage);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('The request timed out. Please try again.');
    }
    throw new ApiError('Could not reach the server. Check your internet connection.');
  } finally {
    clearTimeout(timeoutId);
  }
}
