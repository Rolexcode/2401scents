import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export function compressImage(file: File, maxWidth = 720, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not load image'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadProductPhoto(dataUrl: string, productId: string): Promise<string> {
  const photoRef = ref(storage, `products/${productId}.jpg`);
  await uploadString(photoRef, dataUrl, 'data_url');
  return getDownloadURL(photoRef);
}
