import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HauthService {
  user$: Observable<any>;
  cred: any;
  user: any;
  email: string;
  emailSent = false;
  authState: any;
  authState1: any;
  actionCodeSettings = {
    url: environment.hospitalRedirectUrl,
    handleCodeInApp: true,
  };

  errorMessage: string;

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    public afs: AngularFirestore
  ) {
    this.user$ = this.auth.authState.pipe(
      switchMap((user$) => {
        // Logged in
        if (user$) {
          return this.afs.doc<any>(`hospital/${user$.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );

    this.auth.authState.subscribe((authState) => {
      this.authState1 = authState;
    });
  }

  get isAuthenticated(): boolean {
    return this.authState !== null;
  }

  get isEmailVerified(): boolean {
    return this.isAuthenticated ? this.authState.emailVerified : false;
  }

  get currentUserId(): string {
    return this.isAuthenticated ? this.authState.uid : null;
  }

  async sendEmailLink(email) {
    const actionCodeSettings = this.actionCodeSettings;
    try {
      await this.auth.sendSignInLinkToEmail(email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      this.emailSent = true;
    } catch (err) {
      this.errorMessage = err.message;
    }
  }

  async confirmSignIn(url) {
    try {
      if (this.auth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('emailForSignIn');

        // If missing email, prompt user for it
        // if (!email) {
        //   email = window.prompt('Please provide your email for confirmation');
        // }

        // Signin user and remove the email localStorage
        const result = await this.auth.signInWithEmailLink(email, url);
        this.updateUserData(result.user);
        window.localStorage.removeItem('emailForSignIn');
      }
    } catch (err) {
      this.errorMessage = err.message;
    }
  }
  async signOut() {
    await this.auth.signOut();
    this.router.navigate(['/hospital/login']);
  }
  private updateUserData(user) {
    // console.log(user.uid);
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `hospital/${user.uid}`
    );

    const data = {
      uid: user.uid,
    };

    userRef.set(data, { merge: true });
    this.router.navigate['user-signup'];
    return userRef.set(data, { merge: true });
  }
}
