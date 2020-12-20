import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-adminlist',
  templateUrl: './adminlist.component.html',
  styleUrls: ['./adminlist.component.css'],
})
export class AdminlistComponent implements OnInit {
  constructor(private http: HttpClient) {}

  URL = environment.apiUrl;

  hURL: string = 'admin/hospital';
  dURL: string = 'admin/diagCenter';
  iURL: string = 'admin/iProvider';

  async ngOnInit() {
    this.listHospital();
    this.listDiag();
    this.listInsurance();
  }

  h: any;
  d: any;
  i: any;

  async listHospital() {
    const res = await this.http
      .get(this.URL + this.hURL, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        this.h = res;
      });
  }
  async listDiag() {
    const res = await this.http
      .get(this.URL + this.dURL, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        this.d = res;
      });
  }
  async listInsurance() {
    const res = await this.http
      .get(this.URL + this.iURL, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        this.i = res;
      });
  }
}
