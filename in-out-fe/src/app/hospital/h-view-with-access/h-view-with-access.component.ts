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

@Component({
  selector: 'app-h-view-with-access',
  templateUrl: './h-view-with-access.component.html',
  styleUrls: ['./h-view-with-access.component.css'],
})
export class HViewWithAccessComponent implements OnInit {
  otherBucket: any;
  x: any;
  uid: any;
  data: any;
  UID: any;
  phone: any;
  mRecordData: any;
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

  async ngOnInit() {
    await this.hauth.user$.subscribe((res) => {
      this.uid = res.uid;
      console.log(this.uid);
    });
  }

  async fetchUserRecords(phone: any) {
    const UID = await this.gen.getUIDfromPhone(phone);
    this.UID = UID.uid;
    console.log(UID);
    this.data = await this.gen.listGrantedReqestsFromUID(UID.uid);
  }
  toDateTime(secs) {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(secs);
    return d;
  }

  async download(id) {
    this.getMRecordData(id);
  }
  naem;
  async updateName(b) {
    this.naem = await this.gen.getMRecordDetailsFromFileId(b);
    console.log(this.naem);
  }

  async getMRecordData(id) {
    this.mRecordData = await this.gen.getMRecordDetailsFromFileId(id);
    console.log(this.mRecordData.url, id);
    this.webAuthSignin(this.mRecordData.url, id);
  }
  BIO_URL = this.BASE_URL + 'admin/getBioData/';
  bio: any;
  async getBiofromUID(uid) {
    const bio = await this.http.get<any>(this.BIO_URL + uid).toPromise();
    console.log(bio);
    return bio;
  }
  async webAuthSignin(url, fileId) {
    this.bio = await this.getBiofromUID(this.UID);

    const cityRef = this.auth.afs.collection('users').doc(this.UID);
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

    const myObjStr = JSON.stringify(this.x);

    console.log(myObjStr);
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
