import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/userFire';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ServerMockService } from 'src/app/services/server-mock.service';
import { WebAuthnService } from 'src/app/services/web-authn.service';
import { WindowService } from 'src/app/services/window.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
  constructor(
    public auth: AuthService,
    private win: WindowService,
    //BIOMETRIC
    private serverMockService: ServerMockService,
    private webAuthnService: WebAuthnService,
    private http: HttpClient
  ) {}

  phone: string;
  users: User[];
  useFingerprint = true;
  webAuthnAvailable = !!navigator.credentials && !!navigator.credentials.create;
  cred: any;
  tempUID: any;
  BASE_URL = environment.apiUrl;

  ngOnInit(): void {}

  async webAuthSignin() {
    const res = await this.http
      .get<any>(this.BASE_URL + 'user/getUid?phoneNumber=' + this.phone)
      .toPromise();

    console.log(res.uid);
    const cityRef = this.auth.afs.collection('users').doc(res.uid);
    const doc = await cityRef.get().toPromise();
    console.log('BR');
    console.log(doc.data());
    const user: User = doc.data();

    const x = {
      email: user.email,
      phone: user.phone,
      credentials: [
        {
          credentialId: user.credentials[0].toUint8Array(),
          publicKey: user.credentials[1].toUint8Array(),
        },
      ],
    };
    const myObjStr = JSON.stringify(x);

    console.log(myObjStr);
    // const user = this.serverMockService.getUser(this.email);
    this.webAuthnService
      .webAuthnSignin(x)
      .then((response) => {
        // TODO: validate attestion
        alert('✅ Congrats! Authentication went fine!');
        console.log('SUCCESSFULLY GOT AN ASSERTION!', response);

        const responseNew = this.http
          .get(this.BASE_URL + 'admin/getCustomToken?uid=' + res.uid, {
            responseType: 'text',
          })
          .toPromise();

        responseNew.then((res) => {
          console.log(res);
          this.auth.auth.signInWithCustomToken(res);
        });
      })
      .catch((error) => {
        alert('🚫 Sorry :( Invalid credentials!');
        console.log('FAIL', error);
      });
  }
}
