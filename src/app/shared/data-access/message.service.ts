import {Injectable, computed, inject, signal, WritableSignal, Signal} from '@angular/core';
import {Observable, merge} from 'rxjs';
import {collection, query, orderBy, limit, Firestore} from 'firebase/firestore';
import {collectionData} from 'rxfire/firestore';
import {map} from 'rxjs/operators';
import {connect} from 'ngxtension/connect';
import {FIRESTORE} from '../../app.config';
import {Message} from "../interfaces";

interface MessageState {
  messages: Message[];
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private firestore: Firestore = inject(FIRESTORE);

  // --- State
  private state: WritableSignal<MessageState> = signal<MessageState>({
    messages: [],
    error: null,
  });


  // --- Selectors
  messages: Signal<Message[]> = computed(() => this.state().messages);
  error: Signal<string | null> = computed(() => this.state().error);


  // --- Sources
  messages$ = this.getMessages();


  // --- Reducers
  constructor() {
    const nextState$ = merge(
      this.messages$.pipe(map((messages) => ({messages})))
    );

    connect(this.state)
      .with(nextState$);
  }

  // --- Functions
  private getMessages(): Observable<Message[]> {
    const messagesCollection = query(
      collection(this.firestore, 'messages'),
      orderBy('created', 'desc'),
      limit(50)
    );

    return collectionData(messagesCollection, {idField: 'id'}).pipe(
      map((messages) => [...messages].reverse())
    ) as Observable<Message[]>
  }
}
