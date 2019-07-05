import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';


import { LoginService } from './providers/login.service';
import { User } from './models/user';
import { NavItem } from './models/navitem';

import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  currentUser: User;

  menu: NavItem [] = [];

  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private loginService: LoginService,
    private router: Router,
  ) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    this.menu = [
      {
        name:'Dashboard' ,
        icon: 'home',
        route: '/'
      },
      {
        name:'Evénements' ,
        icon: 'folder',
        route: '/event'
      },
      {
        name: 'Lieux',
        icon: 'folder',
        route: '/lieux'
      }
    ];



    this.loginService.currentUser.subscribe(x => this.currentUser = x);

    // console.log(this.loginService.getLoggedIn());

    if (electronService.isElectron()) {
      console.log('Mode electron');

    } else {
      console.log('Mode web');
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
