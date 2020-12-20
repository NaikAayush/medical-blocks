import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(private http: HttpClient) {}

  BASE_URL = environment.apiUrl;

  async getUIDfromPhone(phone) {
    const URL = this.BASE_URL + 'user/getUid?phoneNumber=';
    return await this.http.get<any>(URL + phone).toPromise();
  }

  async listMRecordsFromUID(UID) {
    const URL = this.BASE_URL + 'user/views/medicalRecord/';

    console.log(URL + UID);

    return await this.http
      .get(URL + UID, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        return res;
      });
    // .then((res) => {
    //   // console.log(res);
    //   return res;
    // });
  }

  async reqAccessFirebaseUpdate(ownerId, hId, fileId) {
    const headers = { 'Content-Type': 'application/json' };
    const URL = this.BASE_URL + 'requestAccess';
    const body = { ownerId: ownerId, hospital: hId, mRecord: fileId };
    console.log(body);
    this.http
      .post<any>(URL, body, {
        headers,
      })
      .subscribe((data) => {
        console.log(data);
        // this.openSnackBar('Hospital Added', 'Close');
      });
  }

  async listReqestsFromUID(UID) {
    const URL = this.BASE_URL + 'user/views/requests/pending/';

    console.log(URL + UID);

    return await this.http
      .get(URL + UID, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        return res;
      });
    // .then((res) => {
    //   // console.log(res);
    //   return res;
    // });
  }
  async getMRecordDetailsFromFileId(fileId) {
    const URL = this.BASE_URL + 'user/views/mRecordId/';

    console.log(URL + fileId);

    return await this.http
      .get(URL + fileId, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        return res;
      });
    // .then((res) => {
    //   // console.log(res);
    //   return res;
    // });
  }

  async getHospitalNameFromUID(UID) {
    const URL = this.BASE_URL + 'user/views/getHospitalName/';

    console.log(URL + UID);

    return await this.http
      .get(URL + UID, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        return res;
      });
  }

  async grantAccessAPI(reqID) {
    const URL = this.BASE_URL + 'grantAccess/';

    // console.log(URL + reqID);

    const headers = { 'Content-Type': 'application/json' };
    const body = { requestId: reqID };
    console.log(body);
    this.http
      .post<any>(URL, body, {
        headers,
      })
      .subscribe((data) => {
        console.log(data);
        // this.openSnackBar('Hospital Added', 'Close');
      });
  }

  async listGrantedReqestsFromUID(UID) {
    const URL = this.BASE_URL + 'user/views/requests/granted/';

    console.log(URL + UID);

    return await this.http
      .get(URL + UID, { responseType: 'json' })
      .toPromise()
      .then((res) => {
        console.log(res);
        return res;
      });
    // .then((res) => {
    //   // console.log(res);
    //   return res;
    // });
  }
}
