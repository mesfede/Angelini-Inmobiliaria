/**
 * Image Optimization and Preloading Utility
 * Compresses images client-side before uploading, and preloads critical assets.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/jpeg' | 'image/webp';
}

/**
 * Compresses an image File or Blob using an offscreen canvas.
 * Reduces 5MB-10MB phone camera photos to ~100KB-200KB WebP/JPEG without perceptible quality loss.
 */
export async function compressImageFile(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<{ dataUrl: string; originalSize: number; compressedSize: number }> {
  const {
    maxWidth = 1600,
    maxHeight = 1200,
    quality = 0.82,
    format = 'image/jpeg',
  } = options;

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions preserving aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(format, quality);
        
        // Calculate rough compressed byte size
        const head = `data:${format};base64,`;
        const base64Data = dataUrl.startsWith(head) ? dataUrl.slice(head.length) : dataUrl;
        const compressedSize = Math.round((base64Data.length * 3) / 4);

        resolve({
          dataUrl,
          originalSize,
          compressedSize,
        });
      };

      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Preload an array of image URLs in the background
 */
export function preloadImages(urls: string[], timeoutMs = 2500): Promise<void> {
  if (!urls || urls.length === 0) return Promise.resolve();

  const promises = urls.slice(0, 8).map((url) => {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Always resolve on error so we don't block
      img.src = url;
    });
  });

  const allPromise = Promise.all(promises).then(() => {});
  const timeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));

  return Promise.race([allPromise, timeoutPromise]);
}
