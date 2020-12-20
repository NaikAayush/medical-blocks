import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { HauthService } from 'src/app/services/hospital/hauth.service';

@Component({
  selector: 'app-u-record-request-access',
  templateUrl: './u-record-request-access.component.html',
  styleUrls: ['./u-record-request-access.component.css'],
})
export class URecordRequestAccessComponent implements OnInit {
  constructor(public gen: GeneralService, public hauth: HauthService) {}
  uid: any;
  async ngOnInit() {
    await this.hauth.user$.subscribe((res) => {
      this.uid = res.uid;
      console.log(this.uid);
    });
  }
  data: any;
  UID: any;
  phone: any;
  async fetchUserRecords(phone: any) {
    const UID = await this.gen.getUIDfromPhone(phone);
    this.UID = UID.uid;
    console.log(UID.uid);
    this.data = await this.gen.listMRecordsFromUID(UID.uid);
  }

  toDateTime(secs: number) {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(secs);
    return d;
  }
  async requestAccess(fileId) {
    console.log(this.UID, this.uid, fileId);
    await this.gen.reqAccessFirebaseUpdate(this.UID, this.uid, fileId);
    console.log(fileId);
  }
}
