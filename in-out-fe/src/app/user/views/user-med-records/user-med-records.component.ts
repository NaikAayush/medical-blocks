import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebAuthnService } from 'src/app/services/web-authn.service';
import { User } from 'src/app/interfaces/userFire';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-med-records',
  templateUrl: './user-med-records.component.html',
  styleUrls: ['./user-med-records.component.css'],
})
export class UserMedRecordsComponent implements OnInit {
  BASE_URL = environment.apiUrl;

  URL = this.BASE_URL + 'user/views/medicalRecord/';
  res: any;
  uid: any;
  arr: any;
  otherBucket: any;
  x: any;
  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private afStorage: AngularFireStorage,
    private _snackBar: MatSnackBar,
    private webAuthnService: WebAuthnService
  ) {
    this.otherBucket = this.afStorage.storage.app.storage();
  }
  BIO_URL = this.BASE_URL + 'admin/getBioData/';
  bio: any;
  async getBiofromUID(uid) {
    const bio = await this.http.get<any>(this.BIO_URL + uid).toPromise();
    console.log(bio);
    return bio;
  }

  async canActivate(): Promise<boolean> {
    const user1 = await this.auth.getUser();
    console.log(user1);
    const uid = user1.uid;
    // console.log(user);

    console.log(uid);
    this.bio = await this.getBiofromUID(uid);
    const cityRef = this.auth.afs.collection('users').doc(uid);
    const doc = await cityRef.get().toPromise();
    console.log('BR');
    console.log(doc.data());
    const user: User = doc.data();

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
    this.uid = user.uid;
    const loggedIn = !!user;

    if (!loggedIn) {
      // do something
    }

    return loggedIn;
  }

  async ngOnInit() {
    await this.canActivate();
    console.log(this.URL + this.uid);

    this.res = await this.http
      .get(this.URL + this.uid, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        this.arr = res;
      });

    // console.log(typeof this.arr);
    // console.log(this.arr);
    console.log(this.arr[0].data.date);
  }

  toDateTime(secs) {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(secs);
    return d;
  }

  currentUserId(): string {
    console.log(this.auth.authState.uid);
    return this.auth.authState.uid;
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

  verifyHash(fileId, hash, callback) {
    const headers = { 'Content-Type': 'application/json' };

    const body = {
      fileId: fileId,
      hash: hash,
    };
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
          return false;
        }
      });
  }
  HASH_URL = this.BASE_URL + 'medicalRecord/verifyHash';

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

  hashFile(file) {
    const readStream = file;
    var wordArray = CryptoJS.lib.WordArray.create(readStream);
    var hash = CryptoJS.SHA256(wordArray);
    var hashed = hash.toString();
    console.log(file);
    console.log(hashed);
    return hashed;
  }
  // fileId: any;
  async webAuthSignin(url, fileId) {
    const myObjStr = JSON.stringify(this.x);

    console.log(myObjStr);
    // const user = this.serverMockService.getUser(this.email);

    this.webAuthnService
      .webAuthnSignin(this.x)
      .then((response) => {
        // TODO: validate attestion
        alert('✅ Congrats! Authentication went fine!');
        // this.x.credentials
        const key = btoa(JSON.stringify(this.bio));
        console.log('key', key);
        this.decrypt(key, url, fileId);
      })
      .catch((error) => {
        alert('🚫 Sorry :( Invalid credentials!');
        console.log('FAIL', error);
      });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
