import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SocialUser } from "angularx-social-login";
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { AlertService } from 'src/app/services/alert.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
declare let ga: Function; // Declare ga as a function

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  public type: any;
  private usersData: SocialUser;
  private loggedIn: boolean;
  submitted: boolean = false;
  textType: string = "text";
  passwordType: string = "password";
  password: string = this.passwordType;
  language: any = [];
  packageRedirect: boolean = false;

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private commonService: CommonHttpService,
    private router: Router,
    public authService: AuthService,
    private alert: AlertService,
    private pushNotification: PushNotificationService,
    private route: ActivatedRoute
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("User Login", "user login", "user login", event.urlAfterRedirects, 6);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;

      },
      err => { }
    )

  }


  ngOnInit() {
    this.pushNotification.requestPermission();
    if (!localStorage.getItem('device_token')) {
      this.sendToken();
    }

    this.route.queryParams.subscribe(params => {
      this.packageRedirect = params['type'] != undefined ? true : false;
      this.commonService.checkLogin(this.packageRedirect);
    });

    this.buildForm();
    this.authService.authState.subscribe((user) => {
      this.usersData = user;
      if (user != undefined) {
        this.loggedIn = (user != null);
        this.manageSocialData();
      }
    });
  }

  showPassword() {
    this.password = this.password == this.passwordType ? this.textType : this.passwordType;
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.type = 'google';
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.type = 'facebook';
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      login_type: [1]
    });
  }

  get f() { return this.loginForm.controls; }

  loginNow() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return false;
    }
    this.loader.display(true);
    const req_url = "login";
    var req_data = this.loginForm.value;
    this.commonService.userLogin(req_url, req_data)
      .subscribe(data => {
        if (data.status == 200) {
          const datas = data.data;
          if (this.language.typeOf == "1") {
          this.alert.success(data.message);
        } else if (this.language.typeOf == "2") {
          this.alert.success(data.message_ar);
        }
          this.commonService.shareUserData(data.user);
          const userData = JSON.stringify(datas.user);
          const localConfigData = {
            userData: userData,
            token: datas.token
          };
          var type = userData['type'] == 1 ? 'Entrepreneur ' : 'Investor';
          this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
              this
                .googleAnalyticsService
                .eventEmitter("User Login with " + type, type, "user login", event.urlAfterRedirects, 26);
            }
          });
          this.sendToken();
          this.commonService.setLocalConfig(localConfigData);
          setTimeout(() => {
            if (!userData['device_token']) {
              this.updateDeviceToken()
            }
          }, 1000);
          if (this.packageRedirect == true) {
            this.router.navigate(['business-valuation'])
          } else {
            this.router.navigate(["home"]);
          }

        } else {
          if (this.language.typeOf == "1") {
            this.alert.info(data.message);
          } else if (this.language.typeOf == "2") {
            this.alert.info(data.message_ar);
          }
          
        }
        this.loader.display(false);


      },
        err => {
          if (typeof err == 'string') {
            this.alert.info(err);
          } else {
            this.alert.error(err.error ? err.error.message : this.language.server_not_responding);
          }
          this.loader.display(false);

        }
      );
  }

  updateDeviceToken() {
    const url = 'updatedevicetoken';
    var token = this.pushNotification.getToken();
    const data = { device_token: token };
    this.commonService.commonPostCall(url, data).subscribe(data => {
    }, error => {
    });

  }


  sendToken() {

    const url = 'updatedevicetoken';
    this.pushNotification.requestPermission().subscribe(token => {
      this.pushNotification.setToken(token);
      const data = { device_token: token };
      this.commonService.commonPostCall(url, data).subscribe(data => {
      })
    }, error => {

    });

  }


  manageSocialData() {
    if (this.type == undefined || this.type == "") {
      return;
    }
    const req_url = "login";
    var req_data = {
      first_name: this.usersData.firstName,
      last_name: this.usersData.lastName,
      social_id: this.usersData.id,
      email: this.usersData.email,
      provider: this.type == "google" ? 1 : 2,
      image: this.usersData.photoUrl,
      login_type: 2
    };
    this.loader.display(true);
    this.commonService.userLogin(req_url, req_data)
      .subscribe(data => {
        const datas = data.data;
        this.loader.display(false);
        if (this.language.typeOf == "1") {
          this.alert.success(data.message);
        } else if (this.language.typeOf == "2") {
          this.alert.success(data.message_ar);
        }
        var userData = JSON.stringify(datas.user)
        const localConfigData = {
          userData: userData,
          token: datas.token
        };

        var type = userData['type'] == 1 ? 'Entrepreneur ' : 'Investor';
        this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            this
              .googleAnalyticsService
              .eventEmitter("User Socail Login with " + type, type, "user Social login", event.urlAfterRedirects, 25);
          }
        });

        this.commonService.setLocalConfig(localConfigData);
        this.router.navigate(["profile"]);
      },
        err => {
          this.loader.display(false);
        }
      );
  }
}
