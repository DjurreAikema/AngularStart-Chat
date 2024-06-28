import {Component, inject, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {LoginStatus} from "../data-access/login.service";
import {Credentials} from "../../../shared/interfaces";

@Component({
  selector: 'app-login-form',
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
    <form [formGroup]="loginForm" (ngSubmit)="login.emit(loginForm.getRawValue())">

      <mat-form-field appearance="fill">
        <mat-label>email</mat-label>
        <input matNativeControl formControlName="email"
               type="email" placeholder="email"/>
        <mat-icon matPrefix>mail</mat-icon>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>password</mat-label>
        <input matNativeControl formControlName="password"
               type="password" placeholder="password"/>
        <mat-icon matPrefix>lock</mat-icon>
      </mat-form-field>

      <button mat-raised-button color="accent" type="submit"
              [disabled]="loginStatus() === 'authenticating'">
        Login
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
export class LoginFormComponent {

  loginStatus: InputSignal<LoginStatus> = input.required<LoginStatus>();
  login: OutputEmitterRef<Credentials> = output<Credentials>();

  private fb: FormBuilder = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    email: [''],
    password: [''],
  });
}
