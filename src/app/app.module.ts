import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/common/header/header.component';
import { FooterComponent } from './component/common/footer/footer.component';

import { JoinComponent } from './component/join/join.component';
import { SignupComponent } from './component/signup/signup.component';
import { LoginComponent } from './component/login/login.component';
import { TopHeaderComponent } from './component/common/top-header/top-header.component';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomLoaderComponent } from './component/common/custom-loader/custom-loader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecaptchaModule } from 'angular-google-recaptcha';
// ng and ngx bootstarp
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectDropDownModule } from 'ngx-select-dropdown'

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { PushNotificationService } from './services/push-notification.service';
import { AsyncPipe } from '../../node_modules/@angular/common';


import { ToastrModule } from 'ngx-toastr';
import { OtpComponent } from './component/otp/otp.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';

import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { NgSelect2Module } from 'ng-select2';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PaymentSuccessComponent } from './component/common/payment-success/payment-success.component';
import { PaymentFailedComponent } from './component/common/payment-failed/payment-failed.component';
import { GoogleAnalyticsService } from './services/google-analytics.service';





const gClientId = environment.google_client_id;
const fClientId = environment.facebook_client_id;
const recaptchaKey = environment.recaptch_site_key;
const config = new AuthServiceConfig(
  [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(gClientId)
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider(fClientId)
    }
  ]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    JoinComponent,
    SignupComponent,
    LoginComponent,
    TopHeaderComponent,
    CustomLoaderComponent,
    OtpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PaymentSuccessComponent,
    PaymentFailedComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SocialLoginModule,
    FormsModule,
    NgSelect2Module,
    SelectDropDownModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    RecaptchaModule.forRoot({
      siteKey: recaptchaKey,
    }),
    ToastrModule.forRoot(),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [{
    provide: AuthServiceConfig,
    useFactory: provideConfig,


  },
    PushNotificationService,
    AsyncPipe,
    GoogleAnalyticsService,
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
