import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { User } from '../../interfaces/userFire';
import { switchMap, map, first } from 'rxjs/operators';
import { ClientDataObj } from 'src/app/interfaces/client-data-obj';
import { DecodedAttestionObj } from 'src/app/interfaces/decoded-attestion-obj';
import * as CBOR from '../../utils/cbor';

class PhoneNumber {
  countryCode: string;
  number: string;

  get e164() {
    const num = this.countryCode + this.number;
    return `${num}`;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;
  cred: any;
  user: any;
  authState: any;

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    public afs: AngularFirestore
  ) {
    this.user$ = this.auth.authState.pipe(
      switchMap((user$) => {
        // Logged in
        if (user$) {
          return this.afs.doc<User>(`users/${user$.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  getUser(): Promise<any> {
    return this.auth.authState.pipe(first()).toPromise();
  }

  getDB() {
    this.user$ = this.auth.authState.pipe(
      switchMap((user$) => {
        // Logged in
        if (user$) {
          return this.afs.doc<User>(`users/${user$.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  sendLoginCode(appVerifier, phoneNumber, windowRef) {
    // const appVerifier = this.windowRef.recaptchaVerifier;
    const num = phoneNumber.e164;
    // console.log(num);

    this.auth
      .signInWithPhoneNumber(num, appVerifier)
      .then((result) => {
        windowRef.confirmationResult = result;
      })
      .catch((error) => console.log(error));
  }

  async verifyLoginCode(verificationCode, windowRef) {
    var credential = firebase.auth.PhoneAuthProvider.credential(
      windowRef.confirmationResult.verificationId,
      verificationCode
    );
    const credentialToken = await this.auth.signInWithCredential(credential);
    this.cred = credentialToken;

    return this.updateUserData(credentialToken.user);

    // const credentialToken = await this.auth.signInWithCredential(credential).then((result) => {
    //   this.user = result.user;
    // });
    // // this.cred = credentialToken;
    // return this.updateUserData(this.user);
  }
  actions: any;

  userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  private updateUserData(user) {
    console.log('ZZZZZZ');
    console.log(user.uid);
    console.log(this.userCollection);
    console.log('ZZZZZZ');
    // Sets user data to firestore on login

    // this.users = this.userCollection.valueChanges();

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data = {
      uid: user.uid,
      phone: user.phoneNumber,
      signUpState: false,
    };
    userRef.set(data, { merge: true });
    this.router.navigate['user-signup'];
    return userRef.set(data, { merge: true });
  }

  public updateBioUserData(user, email, name) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data = {
      email: email,
      name: name,
      credentials: [],
      // signUpState: false,
    };
    // console.log(data);

    return userRef.set(data, { merge: true });
  }

  public updateBioUserData2(user, credentialId, publicKeyBytes) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const credBlob = firebase.firestore.Blob.fromUint8Array(credentialId);
    const publicKeyBlob = firebase.firestore.Blob.fromUint8Array(
      publicKeyBytes
    );

    const data = {
      credentials: [credBlob, publicKeyBlob],
      trustedContacts: [],
    };
    // console.log(data);

    return userRef.set(data, { merge: true });
  }

  registerCredential(user: User, credential: PublicKeyCredential): any {
    const authData = this.extractAuthData(credential);
    const credentialIdLength = this.getCredentialIdLength(authData);
    const credentialId: Uint8Array = authData.slice(
      55,
      55 + credentialIdLength
    );
    console.log('credentialIdLength', credentialIdLength);
    console.log('credentialId', credentialId);
    const publicKeyBytes: Uint8Array = authData.slice(55 + credentialIdLength);
    const publicKeyObject = CBOR.decode(publicKeyBytes.buffer);
    console.log('publicKeyObject', publicKeyObject);

    const valid = true;

    if (valid) {
      // user.credentials.push({ credentialId, publicKey: publicKeyBytes });
      this.updateBioUserData2(user, credentialId, publicKeyBytes);
      console.log(user.credentials);
      return user;
    }
    return valid;
  }

  webAuthnSignin(user: User): Promise<any> {
    const allowCredentials: PublicKeyCredentialDescriptor[] = user.credentials.map(
      (c) => {
        console.log(c.credentialId);
        return {
          type: 'public-key',
          id: Uint8Array.from(Object.values(c.credentialId)),
        };
      }
    );

    console.log('allowCredentials', allowCredentials);

    const credentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: this.getChallenge(),
      allowCredentials,
    };

    return navigator.credentials.get({
      publicKey: credentialRequestOptions,
    });
  }

  getUsers(): User[] {
    const usersString = localStorage.getItem('users');
    return usersString ? JSON.parse(usersString) : [];
  }

  getChallenge() {
    return Uint8Array.from('someChallengeIsHereComOn', (c) => c.charCodeAt(0));
  }

  extractAuthData(credential: PublicKeyCredential): Uint8Array {
    // decode the clientDataJSON into a utf-8 string
    const utf8Decoder = new TextDecoder('utf-8');
    const decodedClientData = utf8Decoder.decode(
      credential.response.clientDataJSON
    );

    const clientDataObj: ClientDataObj = JSON.parse(decodedClientData);
    console.log('clientDataObj', clientDataObj);

    const decodedAttestationObj: DecodedAttestionObj = CBOR.decode(
      (credential.response as any).attestationObject
    );
    console.log('decodedAttestationObj', decodedAttestationObj);

    const { authData } = decodedAttestationObj;
    console.log('authData', authData);

    return authData;
  }

  getCredentialIdLength(authData: Uint8Array): number {
    // get the length of the credential ID
    const dataView = new DataView(new ArrayBuffer(2));
    const idLenBytes = authData.slice(53, 55);
    idLenBytes.forEach((value, index) => dataView.setUint8(index, value));
    return dataView.getUint16(0);
  }

  getItem(uid: string): Observable<any> {
    const itemDoc = this.afs.doc<User>(`users/${uid}`);
    const item$ = itemDoc.snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data();
          data.id = action.payload.id;
          return data;
        }
      })
    );

    return item$;
  }

  async signOut() {
    await this.auth.signOut();
    this.router.navigate(['phone']);
  }
  // verifyLoginCode(verificationCode, windowRef) {
  //   windowRef.confirmationResult
  //     .confirm(verificationCode)
  //     .then((result) => {
  //       this.user = result.user;
  //       console.log(result.user);
  //     })
  //     .catch((error) => console.log(error, 'Incorrect code entered?'));
  // }
  // async verifyLoginCode(verificationCode, windowRef) {
  //   const credentialToken = await windowRef.confirmationResult.confirm(
  //     verificationCode
  //   );
  //   this.cred = credentialToken;
  //   this.auth.signInAndRetrieveDataWithCredential
  //   return this.updateUserData(credentialToken.user);
  // }

  //   async verifyLoginCode(verificationCode, windowRef) {
  //     this.windowRef.confirmationResult

  //     var credential = firebase.auth.PhoneAuthProvider.credential(
  //       windowRef.confirmationResult.verificationId,
  //       verificationCode
  //     );
  // this.auth.
  //     const credentialToken = await this.auth.signInWithCredential(credential);

  //     this.cred = credentialToken;
  //     return this.updateUserData(credentialToken.user);
  //   }

  // const credentialToken = await this.auth.signInAndRetrieveDataWithCredential(
  //   credential
  // );
}
