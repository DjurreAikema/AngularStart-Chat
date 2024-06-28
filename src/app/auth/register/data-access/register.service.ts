import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {catchError, EMPTY, merge, Subject, switchMap} from "rxjs";
import {Credentials} from "../../../shared/interfaces";
import {AuthService} from "../../../shared/data-access/auth.service";
import {map} from "rxjs/operators";
import {connect} from "ngxtension/connect";

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

interface RegisterState {
  status: RegisterStatus;
}

@Injectable()
export class RegisterService {

  private authService: AuthService = inject(AuthService);

  // --- State
  private state: WritableSignal<RegisterState> = signal<RegisterState>({
    status: 'pending',
  });


  // --- Selectors
  status: Signal<RegisterStatus> = computed(() => this.state().status);


  // --- Sources
  error$ = new Subject<any>();
  createUser$: Subject<Credentials> = new Subject<Credentials>();
  private userCreated$ = this.createUser$.pipe(
    switchMap((credentials) =>
      this.authService.createAccount(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      )
    )
  );


  // --- Reducers
  constructor() {
    const nextState$ = merge(
      // userCreated$ reducer
      this.userCreated$.pipe(map(() => ({status: 'success' as const}))),
      // createUser$ reducer
      this.createUser$.pipe(map(() => ({status: 'creating' as const}))),
      // error$ reducer
      this.error$.pipe(map(() => ({status: 'error' as const}))),
    )

    connect(this.state)
      .with(nextState$);
  }

  // --- Functions
}
