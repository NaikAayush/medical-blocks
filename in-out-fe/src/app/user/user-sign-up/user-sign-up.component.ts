import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/interfaces/userFire';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ServerMockService } from 'src/app/services/server-mock.service';
import { WebAuthnService } from 'src/app/services/web-authn.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RippleAnimationConfig } from '@angular/material/core';
@Component({
  selector: 'app-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrls: ['./user-sign-up.component.css'],
})
export class UserSignUpComponent implements OnInit {
  //BIOMETRIC
  email: string;
  name: string;
  users: User[];
  useFingerprint = true;
  webAuthnAvailable = !!navigator.credentials && !!navigator.credentials.create;
  cred: any;
  tempUID: any;
  postForm: NgForm;
  //BIOMETRIC
  constructor(
    public auth: AuthService,
    //BIOMETRIC
    private serverMockService: ServerMockService,
    private webAuthnService: WebAuthnService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {}

  async signUpWithFingerPrint(name, email) {
    console.log('BIO SIGNUP');
    // const status = this.auth.auth.currentUser;
    const userObj = await this.auth.auth.authState.pipe(first()).toPromise();

    // if (userObj) {
    //   console.log('LOGGED IN');
    //   console.log(userObj.uid);
    //   // User is signed in.
    // } else {
    //   console.log('LOGGED OUT');
    //   // No user is signed in.
    // }

    // Save into the 'DB'
    // const prevUser = this.serverMockService.getUser(this.email);
    // if (prevUser) {
    //   alert('🚫 User already exists with this email address');
    //   return;
    // }

    this.auth.updateBioUserData(userObj, email, name);

    // const a = this.auth.getItem(userObj.uid);

    const userObjNew = await this.auth.auth.authState.pipe(first()).toPromise();
    // console.log(a);

    // const user: User = this.serverMockService.addUser({
    //   email: this.email,
    //   name: this.name,
    //   credentials: [],
    // });

    // this.users = this.serverMockService.getUsers();

    // Ask for WebAuthn Auth method
    console.log(userObjNew);

    if (this.webAuthnAvailable && this.useFingerprint) {
      this.webAuthnService
        .webAuthnSignup(userObjNew)
        .then((credential: PublicKeyCredential) => {
          console.log('credentials.create RESPONSE', credential);
          // const valid = this.serverMockService.registerCredential(
          //   userObjNew,
          //   credential
          // );
          const valid = this.auth.registerCredential(userObjNew, credential);
          console.log(userObjNew);
          this.router.navigate(['/user/dash']);

          // this.users = this.serverMockService.getUsers();
        })
        .catch((error) => {
          console.log('credentials.create ERROR', error);
        });
    }
  }
}
