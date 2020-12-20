import { Component, OnInit } from '@angular/core';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { User } from '../user.model';
import { switchMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

import { ServerMockService } from '../../services/server-mock.service';
import { WebAuthnService } from '../../services/web-authn.service';

@Component({
  selector: 'app-login-phone',
  templateUrl: './login-phone.component.html',
  styleUrls: ['./login-phone.component.css'],
})
export class LoginPhoneComponent implements OnInit {
  signUpStatus: any;
  uid: any;

  user$: Observable<any>;
  user: any;
  localUser: any;
  authState: boolean = false;
  userRef: any;
  signUpState: boolean = false;
  credential: any;

  constructor(
    private router: Router,
    public afAuth: AngularFireAuth,
    private http: HttpClient,
    public afs: AngularFirestore,
    private serverMockService: ServerMockService,
    private webAuthnService: WebAuthnService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return null;
        }
      })
    );
  }

  // private updateUserData(user) {
  //   // Sets user data to firestore on login
  //   const userRef: AngularFirestoreDocument<User> = this.afs.doc(
  //     `users/${user.uid}`
  //   );

  //   const data = {
  //     uid: user.uid,
  //     signUpState: false,
  //   };

  //   return userRef.set(data, { merge: true });
  // }

  ngOnInit() {
    this.user$ = this.afAuth.authState;
    console.log(this.signUpState);
    console.log(this.authState);

    this.afAuth.onAuthStateChanged((user$) => {
      if (user$) {
        this.localUser = user$;
        this.uid = user$.uid;

        this.userRef = this.afs.doc<User>(`users/${this.uid}`).valueChanges();
        console.log(this.userRef);
        this.userRef.subscribe((value) => {
          this.signUpState = value.signUpState;
          console.log(this.signUpState);
          console.log(this.authState);
        });
      } else {
      }
    });
    this.afAuth.authState.subscribe((res) => {
      if (res && res.uid) {
        this.authState = true;
        // console.log('user is logged in');
      } else {
        this.authState = false;
        // console.log('user not logged in');
      }
    });
  }

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    console.log('In Redirect');
    this.credential = signInSuccessData.authResult;
    console.log(this.credential.user);

    this.userRef.subscribe((value) => {
      this.signUpState = value.signUpState;
    });
    if (this.signUpState) {
      this.router.navigate(['login']);
    } else {
      this.updateSignUpState(this.credential.user);
    }

    // this.router.navigate(['signup-data']);
    // return this.updateUserData(credential.user);
  }

  private updateSignUpState(user) {
    console.log(user.uid);
    this.signUpState = false;
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data = {
      uid: user.uid,
      signUpState: this.signUpState,
      phone: user.phoneNumber,
    };

    return userRef.set(data, { merge: true });
  }

  private updateUserData(uid, name, email) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}`
    );

    const data = {
      uid: uid,
      name: name,
      email: email,
      signUpState: true,
      // displayName: user.displayName,
      // photoURL: user.photoURL,
    };

    return userRef.set(data, { merge: true });
  }

  onSubmitallDetails(form: NgForm) {
    this.updateUserData(this.uid, form.value.name, form.value.email);
    this.router.navigate(['login']);
    // console.log(form.value.name);
    // console.log(form.value.email);
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
}

//   ngOnInit() {
//     this.user$ = this.afAuth.authState;
//     this.user = this.user$;
//     // console.log(this.authState);
//     this.afAuth.onAuthStateChanged((user$) => {
//       if (user$) {
//         this.uid = user$.uid;
//         console.log(this.uid);
//         console.log(this.user.phoneNumber);
//         // this.router.navigate('home');
//       } else {
//         // this.router.navigate('login');
//       }
//     });

//     this.afAuth.authState.subscribe(this.firebaseAuthChangeListener);
//     console.log(this.authState);

//     // otp();
//     // this.uid = this.afAuth.authState.uid
//     // console.log(this.user$.uid);
//   }
//   private firebaseAuthChangeListener(response) {
//     // if needed, do a redirect in here
//     if (response) {
//       this.authState = true;
//       // console.log('Logged in :)');
//     } else {
//       this.authState = false;
//       console.log(this.authState);
//     }
//   }

//   // private updateUserData(user) {
//   //   // Sets user data to firestore on login
//   //   const userRef: AngularFirestoreDocument<User> = this.afs.doc(
//   //     `users/${user.uid}`
//   //   );

//   //   const data = {
//   //     uid: user.uid,
//   //     // email: user.email,
//   //     phone: user.phoneNumber,
//   //     // displayName: user.displayName,
//   //     // photoURL: user.photoURL,
//   //   };

//   // return userRef.set(data, { merge: true });
//   // }

//   // private updateSignUpState(user) {
//   //   this.signUpState = false;
//   //   // Sets user data to firestore on login
//   //   const userRef: AngularFirestoreDocument<User> = this.afs.doc(
//   //     `users/${user.uid}`
//   //   );

//   //   const data = {
//   //     uid: user.uid,
//   //     signUpState: false,
//   //     // phone: user.phoneNumber,
//   //     // displayName: user.displayName,
//   //     // photoURL: user.photoURL,
//   //   };

//   //   return userRef.set(data, { merge: true });
//   // }

//   successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
//     const credential = signInSuccessData.authResult;
//     // this.updateSignUpState(credential.user);
//     // this.router.navigate(['signup-data']);
//     // return this.updateUserData(credential.user);
//   }

//   SignOut() {
//     return this.afAuth.signOut().then(() => {
//       this.router.navigate(['login']);
//     });
//   }

//   checkSignUpStatus() {
//     this.http
//       .get<any>('https://api.npms.io/v2/search?q=scope:angular')
//       .subscribe((data) => {
//         this.signUpStatus = data.total;
//       });
//   }

//   onSubmit() {}

//   // getUid() {
//   //   this.afAuth.authUser.uid;
//   // }
// }
