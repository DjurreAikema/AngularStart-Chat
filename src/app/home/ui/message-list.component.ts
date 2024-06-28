import {Component, input, InputSignal} from '@angular/core';
import {Message} from "../../shared/interfaces";


@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [],
  template: `
    <ul class="gradient-bg">

      @for (message of messages(); track message.created) {
        <li>
          <div class="avatar animate-in-primary">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed={{message.author.split('@')[0]}}" alt=""/>
          </div>

          <div class="message animate-in-secondary">
            <small>{{ message.author }}</small>
            <p>{{ message.content }}</p>
          </div>
        </li>
      }

    </ul>
  `,
  styles: ``
})
export class MessageListComponent {

  messages: InputSignal<Message[]> = input.required<Message[]>();

}
