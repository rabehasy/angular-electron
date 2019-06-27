import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../models/user';
import { UserService } from '../../providers/user.service';
import { LoginService } from '../../providers/login.service';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import {TranslateService} from "@ngx-translate/core";

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
    public loginService:LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    // redirection vers login si non connecté
    /*if (!this.loginService.currentUserValue) {
      this.router.navigate(['/login']);
    }*/
  }

  ngOnInit() {
    this.loading = true;
    this.userService.all().pipe(first()).subscribe(users => {
      this.loading = false;
      this.users = users;
    });

    this.userService.me().pipe(first()).subscribe(me => {
      this.loading = false;
      this.me = me;
    });
  }

}
