import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebAuthnService } from 'src/app/services/web-authn.service';
import { User } from 'src/app/interfaces/userFire';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { TrustService } from 'src/app/services/user/trust.service';
import { GeneralService } from 'src/app/services/general.service';
@Component({
  selector: 'app-u-list-trusted',
  templateUrl: './u-list-trusted.component.html',
  styleUrls: ['./u-list-trusted.component.css'],
})
export class UListTrustedComponent implements OnInit {
  constructor(
    public auth: AuthService,
    private _snackBar: MatSnackBar,
    private trust: TrustService,
    private gen: GeneralService
  ) {}
  arr;
  b = 'hi';
  myUID;
  phoneNo;
  async ngOnInit() {
    const user = await this.auth.getUser();
    // console.log(user);
    // const uid = user.uid;
    this.myUID = user.uid;
    this.arr = await this.trust.getTrustedUserListFromUID(this.myUID);
  }
  async revokeAccess(contactUID) {
    this.trust.revokeAccess(this.myUID, contactUID);
  }
  async addTrustedContact(phoneNo) {
    const contactUID = await this.gen.getUIDfromPhone(phoneNo);
    this.trust.addTrustedContact(this.myUID, contactUID.uid);
  }
}
