import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {
  User, Auth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {AUTH} from "../../app.config";
import {authState} from "rxfire/auth";
import {defer, from, merge, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {connect} from "ngxtension/connect";
import {Credentials} from "../interfaces";

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(AUTH);

  // --- State
  private state: WritableSignal<AuthState> = signal<AuthState>({
    user: undefined,
  });


  // --- Selectors
  user: Signal<AuthUser> = computed(() => this.state().user);


  // --- Sources
  private user$: Observable<User | null> = authState(this.auth);


  // --- Reducers
  constructor() {
    const nextState$ = merge(
      // user$ reducer
      this.user$.pipe(map((user) => ({user}))),
    );

    connect(this.state)
      .with(nextState$);
  }

  // --- Functions
  login(credentials: Credentials) {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }

  logout(): void {
    signOut(this.auth);
  }

  createAccount(credentials: Credentials) {
    return from(
      defer(() =>
        createUserWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }
}
