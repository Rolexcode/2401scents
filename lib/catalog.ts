import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from '@/types/product';

const productsRef = collection(db, 'products');

export function subscribeToProducts(callback: (products: Product[]) => void) {
  const q = query(productsRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
    callback(products);
  });
}

export async function addProduct(data: Omit<Product, 'id'>) {
  const docRef = await addDoc(productsRef, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await updateDoc(doc(db, 'products', id), data as any);
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id));
}

export async function toggleStock(id: string, currentInStock: boolean) {
  await updateDoc(doc(db, 'products', id), { inStock: !currentInStock });
}
