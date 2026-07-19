export const STORE_NAME = '2401scents';
export const STORE_TAGLINE = 'Nothing is more memorable than a good scent';
export const WHATSAPP_NUMBER = '2349131567184';
export const INSTAGRAM_URL = 'https://instagram.com/2401scents';
export const TIKTOK_URL = 'https://www.tiktok.com/@2401scents';

export function formatNaira(n: number | string) {
  if (n === '' || n === null || n === undefined || isNaN(Number(n))) return '';
  return '₦' + Number(n).toLocaleString('en-NG');
}

export function waLink(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}