import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AuthService} from "../../../shared/data-access/auth.service";
import {catchError, EMPTY, merge, Subject, switchMap} from "rxjs";
import {Credentials} from "../../../shared/interfaces";
import {map} from "rxjs/operators";
import {connect} from "ngxtension/connect";

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

interface LoginState {
  status: LoginStatus;
}

@Injectable()
export class LoginService {

  private authService: AuthService = inject(AuthService);

  // --- State
  private state: WritableSignal<LoginState> = signal<LoginState>({
    status: 'pending',
  });


  // --- Selectors
  status: Signal<LoginStatus> = computed(() => this.state().status);


  // --- Sources
  error$: Subject<any> = new Subject<any>();
  login$: Subject<Credentials> = new Subject<Credentials>();

  userAuthenticated$ = this.login$.pipe(
    switchMap((credentials) =>
      this.authService.login(credentials).pipe(
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
      // userAuthenticated$ reducer
      this.userAuthenticated$.pipe(map(() => ({status: 'success' as const}))),
      // login$ reducer
      this.login$.pipe(map(() => ({status: 'authenticating' as const}))),
      // error$ reducer
      this.error$.pipe(map(() => ({status: 'error' as const})))
    );

    connect(this.state)
      .with(nextState$);
  }
}
