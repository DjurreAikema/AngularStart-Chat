import {Component, effect, inject} from '@angular/core';
import {MessageListComponent} from "./ui/message-list.component";
import {MessageService} from "../shared/data-access/message.service";
import {MessageInputComponent} from "./ui/message-input.component";
import {AuthService} from "../shared/data-access/auth.service";
import {Router} from "@angular/router";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MessageListComponent,
    MessageInputComponent,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  template: `
    <div class="home-container">
      <mat-toolbar color="primary">
        <span class="spacer"></span>
        <button mat-icon-button (click)="authService.logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <app-message-list [messages]="messageService.messages()" [activeUser]="authService.user()"/>
      <app-message-input (send)="messageService.add$.next($event)"/>
    </div>
  `,
  styles: [`
    .home-container {
      height: 100%;

      display: grid;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr) 100px;
      grid-template-areas:
        "header"
        "body"
        "footer";

      justify-items: stretch;
      align-items: stretch;

      overflow: hidden;
    }

    mat-toolbar {
      grid-area: header;
      box-shadow: 0px -7px 11px 0px var(--accent-color);
    }

    app-message-list {
      grid-area: body;
      height: 100%;
      width: 100%;
    }

    app-message-input {
      grid-area: footer;
      position: fixed;
      bottom: 0;
    }
  `]
})
export default class HomeComponent {

  public messageService: MessageService = inject(MessageService);
  public authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {
    effect((): void => {
      if (!this.authService.user()) {
        this.router.navigate(['auth', 'login']);
      }
    });
  }

}
