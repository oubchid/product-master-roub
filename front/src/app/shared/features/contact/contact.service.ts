import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, delay } from "rxjs/operators";

export interface ContactForm {
  email: string;
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = "/api/contact";

  public sendContactForm(formData: ContactForm): Observable<boolean> {
    // Dans un environnement réel, nous enverrions les données à une API
    // Pour l'instant, nous simulons un délai et retournons un succès
    return of(true).pipe(
      delay(1000), // Simuler un délai réseau
      catchError(() => of(false))
    );
  }
}
