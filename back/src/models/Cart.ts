import { Product } from './Product';

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: number;
  updatedAt: number;
  product?: Product;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: number;
  updatedAt: number;
}

export type CreateCartItemDTO = Omit<
  CartItem,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateCartItemDTO = Partial<
  Omit<CartItem, 'id' | 'userId' | 'productId' | 'createdAt' | 'updatedAt'>
>;
