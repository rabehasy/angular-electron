import { Injectable } from '@angular/core';
import {ElectronService} from "./electron.service";
import { AppConfig } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService  {

  isElectron: boolean;
  confExists: boolean;
  electron: ElectronService;
  configFile: string;

  constructor(electron: ElectronService) {
    this.electron = electron;

    if (this.electron.isElectron()) {
      this.initElectron();
    }


  }

  save(key: string, content: string) {
    if (this.isElectron) {
      let data =  {};
      data[key] =  content;
      this.electron.fs.writeFileSync(this.configFile, JSON.stringify(data));
      return;
    }

    localStorage.setItem(key, JSON.stringify(content));
  }

  remove(key: string) {

    if (this.isElectron) {
      // Remove file
      this.electron.fs.unlinkSync(this.configFile);
      return;
    }

    localStorage.removeItem(key);
  }

  get(key: string) {

    if (this.isElectron && this.electron.fs.existsSync(this.configFile)) {
      let jsonContents = this.electron.fs.readFileSync(this.configFile, "utf8");
      jsonContents = JSON.parse(jsonContents);
      return JSON.stringify(jsonContents[key]);
    }
    return localStorage.getItem(key);
  }

  private initElectron() {
    this.isElectron = true;
    this.configFile = this.electron.remote.app.getPath('userData') + '/' + AppConfig.configFile; // C:\Users\Miary\AppData\Roaming\angular-electron\paramApp.json
    this.confExists = this.electron.fs.existsSync(this.configFile);
  }
}
