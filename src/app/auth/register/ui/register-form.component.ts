import {Component, inject, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RegisterStatus} from "../data-access/register.service";
import {Credentials} from "../../../shared/interfaces";
import {passwordMatchesValidator} from "../utils/password-matches";

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" #form="ngForm">

      <mat-form-field appearance="fill">
        <mat-label>email</mat-label>
        <input matNativeControl formControlName="email"
               type="email" placeholder="email"/>
        <mat-icon matPrefix>email</mat-icon>

        @if ((registerForm.controls.email.dirty || form.submitted) && !registerForm.controls.email.valid) {
          <mat-error>Please provide a valid email</mat-error>
        }

      </mat-form-field>

      <mat-form-field>
        <mat-label>password</mat-label>
        <input matNativeControl formControlName="password"
               type="password" placeholder="password"
               data-test="create-password-field"/>
        <mat-icon matPrefix>lock</mat-icon>

        @if ((registerForm.controls.password.dirty || form.submitted) && !registerForm.controls.password.valid) {
          <mat-error>Password must be at least 8 characters long</mat-error>
        }

      </mat-form-field>

      <mat-form-field>
        <mat-label>confirm password</mat-label>
        <input matNativeControl formControlName="confirmPassword"
               type="password" placeholder="confirm password"/>
        <mat-icon matPrefix>lock</mat-icon>

        @if ((registerForm.controls.confirmPassword.dirty || form.submitted) && registerForm.hasError('passwordMatch')) {
          <mat-error>Must match password field</mat-error>
        }

      </mat-form-field>

      @if (status() === 'error') {
        <mat-error>Could not create account with those details.</mat-error>
      } @else if (status() === 'creating') {
        <mat-spinner diameter="50"></mat-spinner>
      }

      <button mat-raised-button color="accent" type="submit"
              [disabled]="status() === 'creating'">
        Submit
      </button>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    button {
      width: 100%;
    }

    mat-error {
      margin: 5px 0;
    }

    mat-spinner {
      margin: 1rem 0;
    }
  `]
})
export class RegisterFormComponent {

  status: InputSignal<RegisterStatus> = input.required<RegisterStatus>();
  register: OutputEmitterRef<Credentials> = output<Credentials>();

  private fb: FormBuilder = inject(FormBuilder);

  registerForm = this.fb.nonNullable.group(
    {
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      updateOn: 'blur',
      validators: [passwordMatchesValidator],
    }
  );

  onSubmit(): void {
    if (!this.registerForm.valid) return;

    const {confirmPassword, ...credentials} = this.registerForm.getRawValue();
    this.register.emit(credentials);
  }

}
