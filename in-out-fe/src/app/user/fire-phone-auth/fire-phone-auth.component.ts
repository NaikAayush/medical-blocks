import { Component, OnInit } from '@angular/core';

import firebase from 'firebase/app';
import { User } from '../../interfaces/userFire';

import { WindowService } from 'src/app/services/window.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ServerMockService } from 'src/app/services/server-mock.service';
import { WebAuthnService } from 'src/app/services/web-authn.service';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import * as firebaseadmin from 'firebase-admin';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

class PhoneNumber {
  countryCode: string;
  number: string;

  get e164() {
    const num = this.countryCode + this.number;
    return `${num}`;
  }
}

@Component({
  selector: 'app-fire-phone-auth',
  templateUrl: './fire-phone-auth.component.html',
  styleUrls: ['./fire-phone-auth.component.css'],
})
export class FirePhoneAuthComponent implements OnInit {
  windowRef: any;
  appVerifier: any;
  phoneNumber = new PhoneNumber();
  verificationCode: string;

  //BIOMETRIC
  email: string = '';
  name: string = '';
  users: User[];
  useFingerprint = true;
  webAuthnAvailable = !!navigator.credentials && !!navigator.credentials.create;
  cred: any;
  tempUID: any;
  //BIOMETRIC
  db = firebase.firestore();

  constructor(
    public auth: AuthService,
    private win: WindowService,
    //BIOMETRIC
    private serverMockService: ServerMockService,
    private webAuthnService: WebAuthnService,
    private http: HttpClient,
    public afs: AngularFirestore
  ) {
    if (auth.user$) {
      console.log('Logged In');
    } else {
      console.log('Logged Out');
    }
    console.log(auth.user$.subscribe());
  }
  userCollection: AngularFirestoreCollection<User>;
  user: Observable<User[]>;
  data: any;
  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
      }
    );
    this.windowRef.recaptchaVerifier.render();
    this.phoneNumber.countryCode = '+91';
    this.appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    console.log(this.auth.user$);
    // this.fingerPrintSignUp();
    // this.brr();
    // this.webAuthSignin();
    //   this.userCollection = this.afs.collection('users');
    //   this.user = this.userCollection.snapshotChanges().pipe(
    //     map((actions) =>
    //       actions.map((a) => {
    //         this.data = a.payload.doc.data() as User;
    //         const id = a.payload.doc.id;
    //         return { id, ...this.data };
    //       })
    //     )
    //   );
    //   console.log(this.data);
    //   console.log('brr');
  }
}
