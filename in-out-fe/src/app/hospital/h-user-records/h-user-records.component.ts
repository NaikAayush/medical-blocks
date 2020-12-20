import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-h-user-records',
  templateUrl: './h-user-records.component.html',
  styleUrls: ['./h-user-records.component.css'],
})
export class HUserRecordsComponent implements OnInit {
  constructor(public gen: GeneralService) {}

  ngOnInit(): void {}
  data: any;
  UID: any;
  phone: any;
  async fetchUserRecords(phone) {
    const UID = await this.gen.getUIDfromPhone(phone);
    console.log(UID);
    this.data = await this.gen.listMRecordsFromUID(UID);
  }
}
