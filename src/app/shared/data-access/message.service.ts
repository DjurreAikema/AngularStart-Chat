import {Injectable, computed, inject, signal, WritableSignal, Signal} from '@angular/core';
import {Observable, merge, defer, Subject, exhaustMap, ignoreElements, catchError, of, retry, filter} from 'rxjs';
import {collection, query, orderBy, limit, Firestore, addDoc} from 'firebase/firestore';
import {collectionData} from 'rxfire/firestore';
import {map} from 'rxjs/operators';
import {connect} from 'ngxtension/connect';
import {FIRESTORE} from '../../app.config';
import {Message} from "../interfaces";
import {AuthService, AuthUser} from "./auth.service";
import {toObservable} from "@angular/core/rxjs-interop";

interface MessageState {
  messages: Message[];
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private firestore: Firestore = inject(FIRESTORE);
  private authService: AuthService = inject(AuthService);

  // --- State
  private state: WritableSignal<MessageState> = signal<MessageState>({
    messages: [],
    error: null,
  });


  // --- Selectors
  messages: Signal<Message[]> = computed(() => this.state().messages);
  error: Signal<string | null> = computed(() => this.state().error);


  // --- Sources
  messages$: Observable<Message[]> = this.getMessages().pipe(
    retry({
      delay: () => this.authUser$.pipe(filter((user) => !!user)),
    }),
  );
  add$: Subject<Message['content']> = new Subject<Message['content']>();

  private authUser$: Observable<AuthUser> = toObservable(this.authService.user);

  // --- Reducers
  constructor() {
    const nextState$ = merge(
      // messages$ reducer
      this.messages$.pipe(map((messages) => ({messages}))),
      // add$ reducer
      this.add$.pipe(
        exhaustMap((message) => this.addMessage(message)),
        ignoreElements(),
        catchError((error) => of({error}))
      ),
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

  private addMessage(message: string) {
    const newMessage: Message = {
      author: this.authService.user()?.email!,
      content: message,
      created: Date.now().toString(),
    };

    const messagesCollection = collection(this.firestore, 'messages');
    return defer(() => addDoc(messagesCollection, newMessage));
  }
}
