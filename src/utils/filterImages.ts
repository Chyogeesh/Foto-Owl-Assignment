import type { FilterMode, PicsumImage } from '../types/gallery';

const matchesFilter = (author: string, mode: FilterMode): boolean => {
  if (mode === 'ALL') return true;
  const firstChar = author.trim().toUpperCase().charAt(0);
  if (mode === 'A-M') return firstChar >= 'A' && firstChar <= 'M';
  return firstChar >= 'N' && firstChar <= 'Z';
};

/** Case-insensitive author search combined with the A-M / N-Z range filter. */
export const filterImages = (
  images: PicsumImage[],
  query: string,
  mode: FilterMode = 'ALL',
): PicsumImage[] => {
  const needle = query.trim().toLowerCase();
  return images.filter(
    (image) =>
      (needle.length === 0 || image.author.toLowerCase().includes(needle)) &&
      matchesFilter(image.author, mode),
  );
};
