import { Routes } from "@angular/router";
import { HomeComponent } from "./shared/features/home/home.component";

export const APP_ROUTES: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.routes").then((m) => m.PRODUCTS_ROUTES),
  },
  {
    path: "cart",
    loadComponent: () =>
      import("./shared/features/cart/cart.component").then(
        (m) => m.CartComponent
      ),
  },
  {
    path: "contact",
    loadComponent: () =>
      import("./shared/features/contact/contact.component").then(
        (m) => m.ContactComponent
      ),
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
];
