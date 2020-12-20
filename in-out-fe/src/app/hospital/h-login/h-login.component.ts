import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { HauthService } from 'src/app/services/hospital/hauth.service';

@Component({
  selector: 'app-h-login',
  templateUrl: './h-login.component.html',
  styleUrls: ['./h-login.component.css'],
})
export class HLoginComponent implements OnInit {
  errorMessage: string;
  uid: any;
  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    public afs: AngularFirestore,
    public hauth: HauthService
  ) {}

  async ngOnInit() {
    const url = this.router.url;
    console.log(url);
    this.hauth.confirmSignIn(url);

    // await this.hauth.user$.subscribe((res) => {
    //   this.uid = res.uid;
    //   console.log(this.uid);
    //   if (this.uid) {
    //     this.router.navigate(['/hospital/dash', this.uid]);
    //   }
    // });

    console.log(this.uid);
  }
}
