import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User } from '../../models/user';
import { UserService } from '../../providers/user.service';
import {LoginService} from "../../providers/login.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading = false;
  users: User[];
  me: User;


  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;

    this.userService.me().pipe(first()).subscribe(me => {
      this.loading = false;
      this.me = me;
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

}
