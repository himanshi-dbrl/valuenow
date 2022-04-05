import { Component, OnInit } from '@angular/core';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router, NavigationEnd } from '@angular/router';
import { SocialUser } from "angularx-social-login";
import { CommonHttpService } from 'src/app/services/common-http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertService } from 'src/app/services/alert.service';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
// import { Constant } from 'src/app/constant';
declare let ga: Function; // Declare ga as a function

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  usersData: SocialUser;
  loggedIn: boolean;
  type: any;
  response: any;
  message: any;
  language: any = [];

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    public authService: AuthService,
    private router: Router,
    private commonService: CommonHttpService,
    private loader: LoaderService,
    private alert: AlertService,
    private pushNotification: PushNotificationService
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("User Join", "user join", "user join", event.urlAfterRedirects, 5);
      }
    });

    this.commonService.checkLogin(false);
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

    this.authService.authState.subscribe((user) => {
      this.usersData = user;
      if (user != undefined) {
        this.loggedIn = (user != null);
        this.manageSocialData();
      }
    });
  }




  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.type = 'google';
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.type = 'facebook';
  }

  signOut(): void {
    this.authService.signOut();
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
      provider: this.type == "GOOGLE" ? 1 : 2,
      image: this.usersData.photoUrl,
      login_type: 2
    };
    this.loader.display(true);
    this.commonService.userLogin(req_url, req_data)
      .subscribe(data => {
        const datas = data.data;
        this.loader.display(false);
        this.alert.success(data.message);
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
}
