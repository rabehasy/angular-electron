import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../providers/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  hideForm: boolean;
  savedForm: boolean;
  errorForm: boolean;

  usernameControl: FormControl;
  passwordControl: FormControl;

  constructor(
    private fb: FormBuilder,
    public service:LoginService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.createForm();
  }

  createForm() {

    this.usernameControl = this.fb.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]);
    this.passwordControl = this.fb.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]);

    this.loginForm = this.fb.group({
      username: this.usernameControl,
      password: this.passwordControl
    });

    // Reset
    this.hideForm = false;
    this.savedForm = false;
    this.errorForm = false;

  }

  onSubmit() {



    let values = this.loginForm.value;
    console.log(values);

    this.service.login(values).subscribe((result) => {
      // result
      console.log(result.token);
      // console.log(typeof result.token === 'undefined');

      let tokenUndefined = typeof result.token !== 'undefined';
      this.hideForm = true;
      this.savedForm = true;

      if (tokenUndefined) {
        // redirect to home after 10 sec
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 5000);
        return true;
      }

      // Show error
      this.hideForm = false;
      this.savedForm = false;
      this.errorForm = true;

      let msgSnack = this.translate.instant('error.form');
      this._snackBar.open(msgSnack, null, {
        duration: 5000,
      });


    }, (err) => {
      console.log(err);
    });


  }

  ngOnInit() {
  }

}
