import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AdminAuthService } from 'src/app/services/admin/admin-auth.service';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css'],
})
export class AdminloginComponent implements OnInit {
  form: FormGroup;

  type: 'login' | 'signup' | 'reset' = 'signup';
  loading = false;

  serverMessage: string;
  user$: Observable<any>;

  constructor(
    public auth: AdminAuthService,
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // this.user$ = this.auth.authState.pipe(
    //   switchMap((user$) => {
    //     // Logged in
    //     if (user$) {
    //       console.log('LOGGED IN');
    //       this.router.navigate(['admin-dash']);
    //       return this.afs.doc<any>(`adminUsers/${user$.uid}`).valueChanges();
    //     } else {
    //       console.log('LOGGED OUT');
    //       // Logged out
    //       return of(null);
    //     }
    //   })
    // );
    // if (this.user$) {
    //   console.log('Logged In');
    // } else {
    //   console.log('Logged Out');
    // }
    // console.log(this.user$.subscribe());
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.required]],
      passwordConfirm: ['', []],
    });
  }

  private updateUserData(user) {
    // console.log(user.uid);
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `adminUsers/${user.uid}`
    );

    const data = {
      uid: user.uid,
      email: user.email,
    };

    return userRef.set(data, { merge: true });
  }

  // async signOut() {
  //   await this.auth.signOut();
  //   this.router.navigate(['admin-login']);
  // }

  changeType(val) {
    this.type = val;
  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get isPasswordReset() {
    return this.type === 'reset';
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch() {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  // async onSubmit() {
  //   this.loading = true;

  //   const email = this.email.value;
  //   const password = this.password.value;

  //   try {
  //     if (this.isLogin) {
  //       await this.auth.signInWithEmailAndPassword(email, password);
  //       // this.router.navigate(['admin-login']);
  //     }
  //     if (this.isSignup) {
  //       const credential = await this.auth.createUserWithEmailAndPassword(
  //         email,
  //         password
  //       );
  //       this.updateUserData(credential.user);
  //     }
  //     if (this.isPasswordReset) {
  //       await this.auth.sendPasswordResetEmail(email);
  //       this.serverMessage = 'Check your email';
  //     }
  //   } catch (err) {
  //     this.serverMessage = err;
  //   }

  //   this.loading = false;
  // }
}
