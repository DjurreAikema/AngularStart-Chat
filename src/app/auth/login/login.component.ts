import {Component, effect, inject} from '@angular/core';
import {LoginService} from "./data-access/login.service";
import {Router, RouterModule} from "@angular/router";
import {LoginFormComponent} from "./ui/login-form.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AuthService} from "../../shared/data-access/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, LoginFormComponent, MatProgressSpinnerModule],
  providers: [LoginService],
  template: `
    <div class="container gradient-bg">
      <app-login-form [loginStatus]="loginService.status()"
                      (login)="loginService.login$.next($event)"/>
      <a routerLink="/auth/register">Create account</a>
    </div>
  `,
  styles: [`
    a {
      margin: 2rem;
      color: var(--accent-darker-color);
    }
  `]
})
export default class LoginComponent {

  public loginService: LoginService = inject(LoginService);
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
