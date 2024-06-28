import {Component, inject} from '@angular/core';
import {MessageListComponent} from "./ui/message-list.component";
import {MessageService} from "../shared/data-access/message.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MessageListComponent
  ],
  template: `
    <div class="container">
      <app-message-list [messages]="messageService.messages()" />
    </div>
  `,
  styles: ``
})
export default class HomeComponent {

  public messageService: MessageService = inject(MessageService);

}
