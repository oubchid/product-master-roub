import { Component, inject } from "@angular/core";
import { CartService, CartItem } from "./cart.service";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputNumberModule } from "primeng/inputnumber";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputNumberModule,
    FormsModule,
    InputTextModule,
  ],
})
export class CartComponent {
  private readonly cartService = inject(CartService);

  public readonly items = this.cartService.items;

  public updateQuantity(item: CartItem, quantity: number): void {
    this.cartService.updateQuantity(item.product.id, quantity);
  }

  public removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  public clearCart(): void {
    this.cartService.clearCart();
  }

  public getTotal(): number {
    return this.items().reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }
}
