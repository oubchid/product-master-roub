import { Injectable, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private readonly _items = signal<CartItem[]>([]);
  public readonly items = this._items.asReadonly();

  public readonly totalItems = signal<number>(0);

  public addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this._items();
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      // Mettre à jour la quantité si le produit existe déjà
      this._items.update((items) =>
        items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Ajouter un nouvel élément au panier
      this._items.update((items) => [...items, { product, quantity }]);
    }

    this.updateTotalItems();
  }

  public removeFromCart(productId: number): void {
    this._items.update((items) =>
      items.filter((item) => item.product.id !== productId)
    );
    this.updateTotalItems();
  }

  public updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this._items.update((items) =>
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );

    this.updateTotalItems();
  }

  public clearCart(): void {
    this._items.set([]);
    this.updateTotalItems();
  }

  private updateTotalItems(): void {
    const total = this._items().reduce((sum, item) => sum + item.quantity, 0);
    this.totalItems.set(total);
  }
}
