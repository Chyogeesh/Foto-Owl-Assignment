import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library/legacy';
import type { PicsumImage } from '../types/gallery';
import { getDownloadUrl } from './images';

export class DownloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DownloadError';
  }
}

/**
 * Downloads the image into the app cache and then saves it to the device gallery.
 * Throws DownloadError with a user-friendly message on failure.
 */
export async function downloadImageToGallery(image: PicsumImage): Promise<void> {
  const permission = await MediaLibrary.requestPermissionsAsync(true, ['photo']);
  if (!permission.granted) {
    throw new DownloadError('Allow photo access in Settings to save images to your gallery.');
  }

  const destination = new File(Paths.cache, `foto-owl-${image.id}.jpg`);
  try {
    const file = await File.downloadFileAsync(getDownloadUrl(image), destination, {
      idempotent: true,
    });
    await MediaLibrary.saveToLibraryAsync(file.uri);
    try {
      file.delete();
    } catch {
      // Cache files are disposable; ignore clean-up problems.
    }
  } catch (error) {
    if (error instanceof DownloadError) throw error;
    throw new DownloadError('Could not download the image. Check your connection and try again.');
  }
}
