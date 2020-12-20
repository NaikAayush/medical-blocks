import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { HauthService } from 'src/app/services/hospital/hauth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebAuthnService } from 'src/app/services/web-authn.service';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { AngularFireStorage } from '@angular/fire/storage';
import { saveAs } from 'file-saver';
import { User } from 'src/app/interfaces/userFire';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebauthnService {
  //VARIABLE
  otherBucket: any;
  x: any;
  uid: any;
  data: any;
  UID: any;
  phone: any;
  mRecordData: any;
  bio;
  BASE_URL = environment.apiUrl;

  constructor(
    public auth: AuthService,
    public gen: GeneralService,
    public hauth: HauthService,
    private _snackBar: MatSnackBar,
    private webAuthnService: WebAuthnService,
    private http: HttpClient,
    private afStorage: AngularFireStorage
  ) {
    this.otherBucket = this.afStorage.storage.app.storage();
  }

  async getBiofromUID(uid) {
    const BIO_URL = this.BASE_URL + 'admin/getBioData/';

    const bio = await this.http.get<any>(BIO_URL + uid).toPromise();
    console.log(bio);
    return bio;
  }

  async webAuthSignin(url, fileId, UID) {
    this.bio = await this.getBiofromUID(UID);

    const cityRef = this.auth.afs.collection('users').doc(UID);
    const doc = await cityRef.get().toPromise();
    console.log('BR');
    console.log(doc.data());
    const user: User = doc.data();
    console.log(doc.data());

    this.x = {
      email: user.email,
      phone: user.phone,
      credentials: [
        {
          credentialId: user.credentials[0].toUint8Array(),
          publicKey: user.credentials[1].toUint8Array(),
        },
      ],
    };
    console.log(this.x);

    const myObjStr = JSON.stringify(this.x);

    console.log(myObjStr);
    // const user = this.serverMockService.getUser(this.email);
    const key = btoa(JSON.stringify(this.bio));
    console.log('key', key);
    this.decrypt(key, url, fileId);
  }

  _arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  _base64ToArrayBuffer(base64) {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  decrypt(key, url, fileId) {
    console.log(url);

    console.log(url);
    fetch(url)
      .then((response) => {
        return response.blob();
      })
      .then((data) => {
        let file2: File = new File([data], 'file');
        console.log(file2);
        let reader2 = new FileReader();
        reader2.onload = (e) => {
          console.log(e.target.result);
          let decrypted = CryptoJS.AES.decrypt(
            new TextDecoder('utf-8').decode(e.target.result as ArrayBuffer),
            key
          );
          console.log(decrypted);
          decrypted = decrypted.toString(CryptoJS.enc.Utf8);
          console.log(decrypted);
          decrypted = this._base64ToArrayBuffer(decrypted);
          console.log(decrypted);
          let decryptedFile = new File([decrypted], file2.name + '.dec', {
            type: file2.type,
          });

          const hash = this.hashFile(decryptedFile);
          this.verifyHash(fileId, hash, () => {
            saveAs(decryptedFile, 'report.pdf');
          });
        };
        reader2.readAsArrayBuffer(file2);
      });
  }
  HASH_URL = this.BASE_URL + 'medicalRecord/verifyHash';

  verifyHash(fileId, hash, callback) {
    const headers = { 'Content-Type': 'application/json' };

    const body = {
      fileId: fileId,
      hash: hash,
    };
    console.log(this.HASH_URL, body);
    this.http
      .post<any>(this.HASH_URL, body, {
        headers,
      })
      .subscribe((data) => {
        // this.fileName = data.id;
        if (data.matched) {
          this.openSnackBar('Hash Verified', 'Close');
          callback();
          return true;
        } else {
          this.openSnackBar('Hash Invalid', 'Close');
          // callback();
          return false;
        }
      });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  hashFile(file) {
    const readStream = file;
    var wordArray = CryptoJS.lib.WordArray.create(readStream);
    var hash = CryptoJS.SHA256(wordArray);
    var hashed = hash.toString();
    console.log(file);
    console.log(hashed);
    return hashed;
  }
}
