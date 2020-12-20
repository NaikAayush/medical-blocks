import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  authState: any;
  user$: Observable<any>;

  constructor(
    public auth: AngularFireAuth,
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.auth.authState.subscribe((authState) => {
      this.authState = authState;
    });
    this.user$ = this.auth.authState.pipe(
      switchMap((user$) => {
        // Logged in
        if (user$) {
          console.log('LOGGED IN');
          this.router.navigate(['admin-dash']);
          return this.afs.doc<any>(`adminUsers/${user$.uid}`).valueChanges();
        } else {
          console.log('LOGGED OUT');
          // Logged out
          return of(null);
        }
      })
    );
  }

  private updateUserData(user) {
    // console.log(user.uid);
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `adminUsers/${user.uid}`
    );

    const data = {
      uid: user.uid,
      email: user.email,
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.auth.signOut();
    this.router.navigate(['admin-login']);
  }

  async onSubmit(
    loading,
    emailI,
    passwordI,
    isLogin,
    isSignup,
    isPasswordReset,
    serverMessage
  ) {
    console.log(
      loading,
      emailI,
      passwordI,
      isLogin,
      isSignup,
      isPasswordReset,
      serverMessage
    );
    loading = true;

    const email = emailI.value;
    const password = passwordI.value;

    try {
      if (isLogin) {
        await this.auth.signInWithEmailAndPassword(email, password);
        // this.router.navigate(['admin-login']);
      }
      if (isSignup) {
        const credential = await this.auth.createUserWithEmailAndPassword(
          email,
          password
        );
        this.updateUserData(credential.user);
      }
      if (isPasswordReset) {
        await this.auth.sendPasswordResetEmail(email);
        serverMessage = 'Check your email';
      }
    } catch (err) {
      serverMessage = err;
    }

    loading = false;
  }
}
