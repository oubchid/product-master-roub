import { Component, inject } from "@angular/core";
import { MenuItem } from "primeng/api";
import { PanelMenuModule } from "primeng/panelmenu";
import { CartService } from "../../features/cart/cart.service";

@Component({
  selector: "app-panel-menu",
  standalone: true,
  imports: [PanelMenuModule],
  template: ` <p-panelMenu [model]="items" styleClass="w-full" /> `,
})
export class PanelMenuComponent {
  private readonly cartService = inject(CartService);

  public readonly items: MenuItem[] = [
    {
      label: "Accueil",
      icon: "pi pi-home",
      routerLink: ["/home"],
    },
    {
      label: "Produits",
      icon: "pi pi-barcode",
      routerLink: ["/products/list"],
    },
    {
      label: "Panier",
      icon: "pi pi-shopping-cart",
      routerLink: ["/cart"],
    },
    {
      label: "Contact",
      icon: "pi pi-envelope",
      routerLink: ["/contact"],
    },
  ];
}
