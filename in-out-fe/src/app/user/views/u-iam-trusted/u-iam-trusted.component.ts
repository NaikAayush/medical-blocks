import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TrustService } from 'src/app/services/user/trust.service';
import { WebauthnService } from 'src/app/services/webauthn/webauthn.service';

@Component({
  selector: 'app-u-iam-trusted',
  templateUrl: './u-iam-trusted.component.html',
  styleUrls: ['./u-iam-trusted.component.css'],
})
export class UIamTrustedComponent implements OnInit {
  constructor(
    private trust: TrustService,
    public auth: AuthService,
    private wauth: WebauthnService
  ) {}
  arr;
  b = 'hi';
  myUID;
  phoneNo;
  records;

  async ngOnInit() {
    const user = await this.auth.getUser();
    // console.log(user);
    // const uid = user.uid;
    this.myUID = user.uid;
    this.arr = await this.trust.getWhoTrustMe(this.myUID);
  }
  async showRecords(uid) {
    this.records = await this.trust.listMRecordsFromUID(uid);
  }

  toDateTime(secs: number) {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(secs);
    return d;
  }
}
