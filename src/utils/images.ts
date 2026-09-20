import type { PicsumImage } from '../types/gallery';
import { DOWNLOAD_MAX_WIDTH } from '../constants';

/** Small cropped thumbnail — far lighter than `download_url`, which is the original file. */
export const getThumbnailUrl = (id: string, width = 600, height = 400): string =>
  `https://picsum.photos/id/${id}/${width}/${height}.jpg`;

/** Resized copy that keeps the original aspect ratio and never exceeds `maxWidth`. */
export const getScaledUrl = (image: PicsumImage, maxWidth: number): string => {
  const width = Math.min(image.width, maxWidth);
  const height = Math.max(1, Math.round((width * image.height) / image.width));
  return `https://picsum.photos/id/${image.id}/${width}/${height}.jpg`;
};

export const getDetailUrl = (image: PicsumImage): string => getScaledUrl(image, 1200);

export const getDownloadUrl = (image: PicsumImage): string =>
  getScaledUrl(image, DOWNLOAD_MAX_WIDTH);
