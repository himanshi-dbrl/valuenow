import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MustMatch } from '../../../helpers/must-match.validator';
import { WhiteSpaceValidator } from 'src/app/helpers/whiteSpace.validator';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
declare var $: any;
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  showPasswordIcon: string = 'fa fa-eye fa-eye-slash';
  hiddenPasswordIcon: string = 'fa fa-eye';
  passwordType: string = 'password';
  textType: string = "text";
  newPasswordField = this.passwordType;
  newPasswordIcon: string = this.hiddenPasswordIcon;
  confirmPasswordField = this.passwordType;
  confirmPasswordIcon: string = this.hiddenPasswordIcon;
  notMatch: boolean = false;
  headerData: object;
  submitted: boolean = false;
  language: any = [];

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private loader: LoaderService, private alert: AlertService, private commonService: CommonHttpService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("Change Password", "change password", "change password", event.urlAfterRedirects, 19);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = {
          title: this.language.change_password, description: ''
        }
      },
      err => { }
    )

  }

  formBuild() {
    this.changePasswordForm = this.formBuilder.group({
      old_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      new_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      c_password: ['', [Validators.required]],
    }, {
      validator: MustMatch('new_password', 'c_password')
    })
  }

  passwordNotMatch(value) {
    if (this.changePasswordForm.get('old_password').value == value) {
      this.notMatch = true;
    } else {
      this.notMatch = false;
    }
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  changeNewPasswordFiled() {
    this.newPasswordField = this.newPasswordField == this.passwordType ? this.textType : this.passwordType;
    this.newPasswordIcon = this.newPasswordIcon == this.hiddenPasswordIcon ? this.showPasswordIcon : this.hiddenPasswordIcon;
  }


  changeConfirmPasswordField() {
    this.confirmPasswordField = this.confirmPasswordField == this.passwordType ? this.textType : this.passwordType;
    this.confirmPasswordIcon = this.confirmPasswordIcon == this.hiddenPasswordIcon ? this.showPasswordIcon : this.hiddenPasswordIcon;
  }

  ngOnInit() {
    this.formBuild();
  }

  changePassword() {
    this.submitted = true;
    if (this.changePasswordForm.invalid || this.notMatch) {
      return;
    }
    this.loader.display(true);
    const req = this.changePasswordForm.value;
    const url = "passwordChange";
    this.commonService.commonPostCall(url, req).subscribe(data => {
      if (data.status == 200) {
        this.submitted = false;
        this.changePasswordForm.reset();
        this.alert.success(data.message);
        this.commonService.deleteLocalConfig();
        this.router.navigate(["login"]);
      } else {
        this.alert.warning(data.message);
      }
      this.loader.display(false);
    }, error => {
      this.loader.display(false);
      this.alert.error(error.error ? error.error.message : error ? error : this.language.server_not_responding);
    })
  }
}
