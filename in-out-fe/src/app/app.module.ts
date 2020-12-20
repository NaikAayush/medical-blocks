import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { ServiceWorkerModule } from '@angular/service-worker';
import { FirePhoneAuthComponent } from './user/fire-phone-auth/fire-phone-auth.component';

import { WindowService } from './services/window.service';
import { AdmindashComponent } from './admin/admindash/admindash.component';
import { AdminloginComponent } from './admin/adminlogin/adminlogin.component';
import { AdminlistComponent } from './admin/adminlist/adminlist.component';

import { LoginPhoneComponent } from './user/login-phone/login-phone.component';
import { UserSignUpComponent } from './user/user-sign-up/user-sign-up.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserDashComponent } from './user/user-dash/user-dash.component';
import { UserMedRecordsComponent } from './user/views/user-med-records/user-med-records.component';

import { HLoginComponent } from './hospital/h-login/h-login.component';
import { HDashComponent } from './hospital/h-dash/h-dash.component';
import { HUploadComponent } from './hospital/h-upload/h-upload.component';
import { HUserRecordsComponent } from './hospital/h-user-records/h-user-records.component';
import { URecordRequestAccessComponent } from './hospital/u-record-request-access/u-record-request-access.component';
import { UVRequestsComponent } from './user/views/u-v-requests/u-v-requests.component';
import { HViewWithAccessComponent } from './hospital/h-view-with-access/h-view-with-access.component';
import { UListTrustedComponent } from './user/views/u-list-trusted/u-list-trusted.component';
import { UIamTrustedComponent } from './user/views/u-iam-trusted/u-iam-trusted.component';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      defaultCountry: 'IN',
      recaptchaParameters: {
        size: 'invisible',
        badge: 'bottomright',
      },
    },
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
};

@NgModule({
  declarations: [
    AppComponent,
    AdmindashComponent,
    AdminloginComponent,
    AdminlistComponent,
    LoginPhoneComponent,
    FirePhoneAuthComponent,

    UserSignUpComponent,
    UserLoginComponent,
    UserDashComponent,
    UserMedRecordsComponent,

    HLoginComponent,
    HDashComponent,
    HUploadComponent,
    HUserRecordsComponent,
    URecordRequestAccessComponent,
    UVRequestsComponent,
    HViewWithAccessComponent,
    UListTrustedComponent,
    UIamTrustedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatToolbarModule,
    MatGridListModule,
    MatSnackBarModule,
    MatTabsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [WindowService],
  bootstrap: [AppComponent],
})
export class AppModule {}
