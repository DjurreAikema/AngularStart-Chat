import {Component, effect, inject} from '@angular/core';
import {RegisterService} from "./data-access/register.service";
import {RegisterFormComponent} from "./ui/register-form.component";
import {AuthService} from "../../shared/data-access/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RegisterFormComponent
  ],
  providers: [RegisterService],
  template: `
    <div class="container gradient-bg">
      <app-register-form [status]="registerService.status()"
                         (register)="registerService.createUser$.next($event)"/>
    </div>
  `,
  styles: ``
})
export default class RegisterComponent {

  public registerService: RegisterService = inject(RegisterService);
  public authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {
    effect((): void => {
      if (this.authService.user()) {
        this.router.navigate(['home']);
      }
    });
  }
}
