export const STORE_NAME = '2401scents';
export const STORE_TAGLINE = 'Curated fragrances, poured daily';
export const WHATSAPP_NUMBER = '2349131567184';

export function formatNaira(n: number | string) {
  if (n === '' || n === null || n === undefined || isNaN(Number(n))) return '';
  return '₦' + Number(n).toLocaleString('en-NG');
}

export function waLink(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
