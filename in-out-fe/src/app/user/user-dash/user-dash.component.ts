import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-user-dash',
  templateUrl: './user-dash.component.html',
  styleUrls: ['./user-dash.component.css'],
})
export class UserDashComponent implements OnInit {
  constructor(public auth: AuthService) {}
  myUID;
  name;
  async ngOnInit() {
    const user = await this.auth.getUser();
    // console.log(user);
    // const uid = user.uid;
    this.myUID = user.uid;
    this.name = user.name;
  }
}
