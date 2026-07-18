export interface Variant {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  deliveryFee: number;
  photoUrl: string | null;
  inStock: boolean;
}

export interface CartItem {
  cartId: string;
  name: string;
  variantLabel: string;
  price: number;
  deliveryFee: number;
}
