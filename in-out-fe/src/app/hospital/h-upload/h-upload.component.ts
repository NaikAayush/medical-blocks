import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

import * as CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';

import { MatSnackBar } from '@angular/material/snack-bar';
import { HauthService } from 'src/app/services/hospital/hauth.service';
import { GeneralService } from 'src/app/services/general.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-h-upload',
  templateUrl: './h-upload.component.html',
  styleUrls: ['./h-upload.component.css'],
})
export class HUploadComponent implements OnInit {
  title: string = 'Medical';
  defaultBucket: any;
  otherBucket: any;
  uid: any;
  key: any;
  BASE_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private afStorage: AngularFireStorage,
    private _snackBar: MatSnackBar,
    public hauth: HauthService,
    public gen: GeneralService
  ) {
    this.defaultBucket = this.afStorage.storage.app.storage();
    this.otherBucket = this.afStorage.storage.app.storage();
  }

  async ngOnInit() {
    await this.hauth.user$.subscribe((res) => {
      this.uid = res.uid;
      console.log(this.uid);
    });
  }

  phone: string;
  hash: any;

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  POST_URL = this.BASE_URL + 'hospital/medicalRecord/';
  POST_ADD_URL = this.BASE_URL + 'hospital/medicalRecord/addUrl';
  BIO_URL = this.BASE_URL + 'admin/getBioData/';
  fileName: any;

  async createmRecordFireStore(name, uid, hId, callback) {
    const headers = { 'Content-Type': 'application/json' };

    const body = {
      doctorName: name,
      owner: uid,
      hospitalId: hId,
      mRecordHash: this.hash,
    };
    console.log(body);
    this.http
      .post<any>(this.POST_URL, body, {
        headers,
      })
      .subscribe((data) => {
        this.fileName = data.id;
        console.log(data);
        this.openSnackBar('Medical Record Added', 'Close');
        callback(this.fileName);
      });
  }

  async addmRecordURL(id, url) {
    const headers = { 'Content-Type': 'application/json' };

    const body = { id: id, url: url };
    console.log(body);
    this.http
      .post<any>(this.POST_ADD_URL, body, {
        headers,
      })
      .subscribe((data) => {
        this.fileName = data.id;
        console.log(data);
        this.openSnackBar('Medical Record URL Added', 'Close');
      });
  }

  async getBiofromUID(uid) {
    console.log(this.BIO_URL + uid);
    const bio = await this.http.get<any>(this.BIO_URL + uid).toPromise();
    console.log(bio);
    return bio;
  }
  recordName: any;

  async decrypt() {
    const storageRef = this.otherBucket.ref().child('hu');

    storageRef.getDownloadURL().then((url) => {
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
              this.key
            );
            console.log(decrypted);
            decrypted = decrypted.toString(CryptoJS.enc.Utf8);
            console.log(decrypted);
            decrypted = this._base64ToArrayBuffer(decrypted);
            console.log(decrypted);
            let decryptedFile = new File([decrypted], file2.name + '.dec', {
              type: file2.type,
            });
            saveAs(decryptedFile, 'nice.pdf');
          };
          reader2.readAsArrayBuffer(file2);
        });
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

  async upload(event) {
    // const res = await this.http
    //   .get<any>(
    //     this.BASE_URL + 'user/getUid?phoneNumber=' +
    //       this.phone
    //   )
    //   .toPromise();
    // // console.log('AAAA');
    // // console.log(res.uid);
    // console.log('AAAAA');
    // const uid = res.uid;

    var uid = await this.gen.getUIDfromPhone(this.phone);
    uid = uid.uid;
    console.log('AAAAA');
    console.log(uid);
    console.log('AAAAA');
    const bio = await this.getBiofromUID(uid);

    this.key = btoa(JSON.stringify(bio));
    console.log('key', this.key);

    // const keyJSON = JSON.stringify(bio);
    // this.key = Buffer.from(keyJSON).toString('base64');

    console.log('Uploading to Fire');
    console.log(this.recordName, uid, this.uid);

    let file = event.target.files[0];
    console.log(file);
    let reader = new FileReader();

    reader.onload = (e) => {
      console.log('Encrypting');
      let encrypted = CryptoJS.AES.encrypt(
        this._arrayBufferToBase64(e.target.result),
        this.key
      );
      console.log(encrypted);

      encrypted = encrypted.toString();

      console.log(encrypted);
      let encryptedFile = new File([encrypted], file.name + '.encrypted', {
        type: file.type,
      });
      console.log('encrypted', encryptedFile);
      this.openSnackBar('encrypted ' + encryptedFile.name, 'close');

      this.hash = this.hashFile(encryptedFile);

      this.createmRecordFireStore(
        this.recordName,
        uid,
        this.uid,
        (filename) => {
          console.log(filename);
          const storageRef = this.otherBucket.ref().child(filename);

          let file = event.target.files[0];
          console.log(file);
          let reader = new FileReader();

          reader.onload = (e) => {
            console.log('Encrypting');
            let encrypted = CryptoJS.AES.encrypt(
              this._arrayBufferToBase64(e.target.result),
              this.key
            );
            console.log(encrypted);

            encrypted = encrypted.toString();

            console.log(encrypted);
            let encryptedFile = new File(
              [encrypted],
              file.name + '.encrypted',
              {
                type: file.type,
              }
            );
            console.log('encrypted', encryptedFile);
            this.openSnackBar('encrypted ' + encryptedFile.name, 'close');

            this.hash = this.hashFile(encryptedFile);
            //TODO get mRecordId
            const fname = uid + '/' + 'mRecordId';
            //TODO
            storageRef.put(encryptedFile).then((snapshot) => {
              console.log('Uploaded a blob or file!', snapshot);

              storageRef.getDownloadURL().then((url) => {
                console.log(url);
                this.addmRecordURL(filename, url);
              });
            });
          };
          reader.readAsArrayBuffer(file);
        }
      );
    };

    reader.readAsArrayBuffer(file);
  }
}
