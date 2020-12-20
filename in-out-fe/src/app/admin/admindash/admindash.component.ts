import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AdminAuthService } from 'src/app/services/admin/admin-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admindash',
  templateUrl: './admindash.component.html',
  styleUrls: ['./admindash.component.css'],
})
export class AdmindashComponent implements OnInit {
  baseURL = environment.apiUrl;
  hURL = 'admin/hospital';
  dURL = 'admin/diagCenter';
  iURL = 'admin/iProvider';
  hName: string;
  hEmail: string;
  dName: string;
  dEmail: string;
  iName: string;
  iEmail: string;
  user$: Observable<any>;
  constructor(
    public auth: AdminAuthService,
    private afs: AngularFirestore,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  async addHospital() {
    const headers = { 'Content-Type': 'application/json' };

    const body = { email: this.hEmail, name: this.hName };
    console.log(body);
    this.http
      .post<any>(this.baseURL + this.hURL, body, {
        headers,
      })
      .subscribe((data) => {
        console.log(data);
        this.openSnackBar('Hospital Added', 'Close');
      });
  }
  async addDCenter() {
    const headers = { 'Content-Type': 'application/json' };

    const body = { email: this.dEmail, name: this.dName };
    console.log(body);
    this.http
      .post<any>(this.baseURL + this.dURL, body, {
        headers,
      })
      .subscribe((data) => {
        console.log(data);
        this.openSnackBar('Diagnostic center Added', 'Close');
      });
  }
  async addICeneter() {
    const headers = { 'Content-Type': 'application/json' };

    const body = { email: this.iEmail, name: this.iName };
    console.log(body);
    this.http
      .post<any>(this.baseURL + this.iURL, body, {
        headers,
      })
      .subscribe((data) => {
        console.log(data);
        this.openSnackBar('Insurance Provider Added', 'Close');
      });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
