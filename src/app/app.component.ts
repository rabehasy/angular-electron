import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { Router } from '@angular/router';

import { LoginService } from './providers/login.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  currentUser: User;

  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private loginService: LoginService,
    private router: Router,
  ) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);



    this.loginService.currentUser.subscribe(x => this.currentUser = x);

    console.log(this.loginService.getLoggedIn());

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
