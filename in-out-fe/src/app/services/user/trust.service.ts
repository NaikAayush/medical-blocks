import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrustService {
  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}
  BASE_URL = environment.apiUrl;
  async getTrustedUserListFromUID(myUID) {
    const URL = this.BASE_URL + 'user/trustedContacts/';
    console.log(URL);
    return await this.http.get<any>(URL + myUID).toPromise();
  }

  async addTrustedContact(myUID, contactUID) {
    const headers = { 'Content-Type': 'application/json' };
    const URL = this.BASE_URL + 'user/trustedContact/';
    const body = { userId: myUID, contactId: contactUID };
    console.log(body);
    this.http
      .post<any>(URL, body, {
        headers,
      })
      .subscribe((data) => {
        console.log(data);
        this.openSnackBar('Trusted Contact Added', 'Close');
      });
  }

  async getWhoTrustMe(UID) {
    const URL = this.BASE_URL + 'user/trustedBy/';
    console.log(URL + UID);
    return await this.http.get<any>(URL + UID).toPromise();
    // .then((res) => {
    //   //List
    //   return res;
    // });
  }

  async revokeAccess(myUID, contactUID) {
    const headers = { 'Content-Type': 'application/json' };
    const URL = this.BASE_URL + 'user/trustedContact/revoke';
    const body = { userId: myUID, contactId: contactUID };
    console.log(body);
    this.http
      .post<any>(URL, body, {
        headers,
      })
      .subscribe((data) => {
        console.log(data);
        this.openSnackBar('Revoked Access', 'Close');
      });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  async listMRecordsFromUID(UID) {
    const URL = this.BASE_URL + 'user/views/medicalRecord/';

    console.log(URL + UID);

    return await this.http.get(URL + UID, { responseType: 'json' }).toPromise();
  }
}
