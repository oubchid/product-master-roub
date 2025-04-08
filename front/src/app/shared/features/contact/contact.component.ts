import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { ContactService } from "./contact.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly messageService = inject(MessageService);

  public contactForm: FormGroup;
  public submitted = false;
  public loading = false;

  constructor() {
    this.contactForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      message: ["", [Validators.required, Validators.maxLength(300)]],
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.valid) {
      this.loading = true;

      this.contactService.sendContactForm(this.contactForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Demande de contact envoyée avec succès",
          });
          this.contactForm.reset();
          this.submitted = false;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: "Une erreur est survenue lors de l'envoi du message",
          });
          this.loading = false;
        },
      });
    }
  }

  public get email() {
    return this.contactForm.get("email");
  }

  public get message() {
    return this.contactForm.get("message");
  }
}
