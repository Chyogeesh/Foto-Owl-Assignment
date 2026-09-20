import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchImagePage } from '../api/picsumApi';
import { PAGE_SIZE } from '../constants';
import type { PicsumImage } from '../types/gallery';

type FetchMode = 'initial' | 'more' | 'refresh';

const mergeUnique = (previous: PicsumImage[], incoming: PicsumImage[]): PicsumImage[] => {
  const seen = new Set(previous.map((image) => image.id));
  return [...previous, ...incoming.filter((image) => !seen.has(image.id))];
};

/**
 * Paginated image loader (infinite scroll + pull-to-refresh).
 * A ref-based guard makes sure only one request is ever in flight, so a refresh
 * or an end-reached event can never trigger duplicate concurrent API calls.
 */
export const useFetchImages = () => {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const isFetchingRef = useRef<boolean>(false);
  const nextPageRef = useRef<number>(1);
  const hasMoreRef = useRef<boolean>(true);
  const isMountedRef = useRef<boolean>(true);

  const fetchImages = useCallback(async (mode: FetchMode) => {
    if (isFetchingRef.current) return;
    if (mode === 'more' && !hasMoreRef.current) return;
    isFetchingRef.current = true;

    const page = mode === 'more' ? nextPageRef.current : 1;
    setError(null);
    if (mode === 'initial') setInitialLoading(true);
    if (mode === 'more') setLoadingMore(true);
    if (mode === 'refresh') setRefreshing(true);

    try {
      const data = await fetchImagePage(page, PAGE_SIZE);
      if (!isMountedRef.current) return;
      setImages((previous) => (mode === 'more' ? mergeUnique(previous, data) : data));
      nextPageRef.current = page + 1;
      hasMoreRef.current = data.length === PAGE_SIZE;
      setHasMore(hasMoreRef.current);
    } catch (caught) {
      if (!isMountedRef.current) return;
      setError(caught instanceof Error ? caught.message : 'Something went wrong.');
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setInitialLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchImages('initial');
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchImages]);

  const loadMore = useCallback(() => {
    fetchImages('more');
  }, [fetchImages]);

  const refresh = useCallback(() => {
    fetchImages('refresh');
  }, [fetchImages]);

  /** Retries whatever failed last: the first page, or the next page. */
  const retry = useCallback(() => {
    fetchImages(nextPageRef.current === 1 ? 'initial' : 'more');
  }, [fetchImages]);

  return { images, initialLoading, loadingMore, refreshing, error, hasMore, loadMore, refresh, retry };
};
