import { Product } from './Product';

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  createdAt: number;
  updatedAt: number;
  product?: Product;
}

export interface Wishlist {
  id: number;
  userId: number;
  items: WishlistItem[];
  totalItems: number;
  createdAt: number;
  updatedAt: number;
}

export type CreateWishlistItemDTO = Omit<
  WishlistItem,
  'id' | 'createdAt' | 'updatedAt'
>;
