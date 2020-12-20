import { Component, OnInit } from '@angular/core';

import firebase from 'firebase/app';

import { WindowService } from 'src/app/services/window.service';
import { AuthService } from 'src/app/services/auth/auth.service';

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

  constructor(public auth: AuthService, private win: WindowService) {
    if (auth.user$) {
      console.log('Logged In');
    } else {
      console.log('Logged Out');
    }
  }

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
  }
}
