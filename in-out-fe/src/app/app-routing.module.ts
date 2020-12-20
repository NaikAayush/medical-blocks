import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmindashComponent } from './admin/admindash/admindash.component';
import { AdminloginComponent } from './admin/adminlogin/adminlogin.component';
import { HDashComponent } from './hospital/h-dash/h-dash.component';
import { HLoginComponent } from './hospital/h-login/h-login.component';
import { FirePhoneAuthComponent } from './user/fire-phone-auth/fire-phone-auth.component';
import { LoginPhoneComponent } from './user/login-phone/login-phone.component';
import { UserDashComponent } from './user/user-dash/user-dash.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserSignUpComponent } from './user/user-sign-up/user-sign-up.component';
import { UIamTrustedComponent } from './user/views/u-iam-trusted/u-iam-trusted.component';
import { UListTrustedComponent } from './user/views/u-list-trusted/u-list-trusted.component';
import { UVRequestsComponent } from './user/views/u-v-requests/u-v-requests.component';
import { UserMedRecordsComponent } from './user/views/user-med-records/user-med-records.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin-dash', component: AdmindashComponent },
  { path: 'admin-login', component: AdminloginComponent },
  { path: 'phone', component: FirePhoneAuthComponent },
  { path: 'user-signup', component: UserSignUpComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'user/dash', component: UserDashComponent },
  { path: 'user/dash/mRecord', component: UserMedRecordsComponent },
  { path: 'hospital/login', component: HLoginComponent },
  { path: 'hospital/dash', component: HDashComponent },
  { path: 'user/dash/viewPendingReq', component: UVRequestsComponent },
  { path: 'user/dash/viewTrustedContacts', component: UListTrustedComponent },
  { path: 'user/dash/viewWhoTrustMe', component: UIamTrustedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
