import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { AlertService } from './alert.service';
import { environment } from '../../environments/environment';
import { configData as configDataEn } from '../../json/strings_en';
import { configData as configDataGer } from '../../json/strings_ger';

@Injectable({
  providedIn: 'root'
})
export class CommonHttpService {
  site_url = environment.web_url;
  readonly base_url = environment.api_url;
  public postData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public userData: BehaviorSubject<object> = new BehaviorSubject<object>({});
  dataLanguage: any = this.getLanguage() == 'en' || "" ? configDataEn : configDataGer;
  private dataSource = new BehaviorSubject<any>(this.dataLanguage);
  languageData = this.dataSource.asObservable();
  language: any = [];

  constructor(private http: HttpClient,
    private alert: AlertService,
    private loaderService: LoaderService,
    private router: Router) {
    this.languageChange();
    this.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
  }


  getPostData(data: any) {
    this.postData.next(data);
  }

  shareUserData(data: object) {
    this.userData.next(data);
  }

  siteUrl() {
    return this.site_url;
  }

  httpOptions: any;
  userType: any;
  mainRoute: string;
  // setHttpOptions() {
  //   this.httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : ''
  //     })
  //   };
  // }

  userLogin(req_url, req_data): Observable<any> {

    // make url
    const url = `${this.base_url}${req_url}`;

    //make request

    return this.http.post(url, req_data)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(
          err => {
            return throwError(err);
          }
        )
      )

  }

  // To make HTTP GET request
  commonGetCall(req_url, req_data?): Observable<any> {

    // make url
    const url = `${this.base_url}${req_url}`;
    // make request

    return this.http.get(url, { params: req_data })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(
          err => {
            if ((err.status && err.status === 401)) {
              this.deleteLocalConfig();
              this.redirectUser();
            }
            return throwError(err);
          }
        ));
  }

  // To make HTTP POST request
  commonPostCall(req_url, req_data): Observable<any> {

    // main route
    this.mainRoute = req_url;
    // make url
    const url = `${this.base_url}${req_url}`;
    // make request
    return this.http.post(url, req_data)
      .pipe(
        map((res: any) => res),
        catchError(
          err => {
            if ((err.status && err.status === 401)) {
              this.deleteLocalConfig();
              this.redirectUser();
            }
            return throwError(err);
          }
        ));
  }

  // To make HTTP PUT request
  commonPutCall(req_url, req_data): Observable<any> {


    // make url
    const url = `${this.base_url}${req_url}`;

    // make request
    return this.http.put(url, req_data)
      .pipe(
        map((res: any) => res),
        catchError(
          err => {
            if ((err.status && err.status === 401)) {
              this.deleteLocalConfig();
              this.redirectUser();
            }
            return throwError(err);
          }
        ));
  }

  // To make HTTP DELETE request
  commonDeleteCall(req_url, req_data): Observable<any> {

    // make url
    const url = `${this.base_url}${req_url}`;

    // make request
    return this.http.delete(url, { params: req_data })
      .pipe(
        map((res: any) => res),
        catchError(
          err => {
            if ((err.status && err.status === 401)) {
              this.deleteLocalConfig();
              this.redirectUser();
            }
            return throwError(err);
          }
        ));
  }


  // To make HTTP DELETE with id request
  commonDeleteWidthIdCall(req_url): Observable<any> {

    // make url
    const url = `${this.base_url}${req_url}`;

    // make request
    return this.http.delete(url)
      .pipe(
        map((res: any) => res),
        catchError(
          err => {
            if ((err.status && err.status === 401)) {
              this.deleteLocalConfig();
              this.redirectUser();
            }
            return throwError(err);
          }
        ));
  }


  commonGetWidthIdCall(req_url, id): Observable<any> {

    // make url
    const url = `${this.base_url}${req_url}/${id}`;
    // make request

    return this.http.get(url)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(
          err => {
            if ((err.status && err.status === 401)) {
              this.deleteLocalConfig();
              this.redirectUser();
            }
            return throwError(err);
          }
        ));

  }

  // To Logout user
  logout() {
    if (!localStorage.getItem('token')) {
      return;
    }
    this.loaderService.display(true);
    const req_url = 'logout';
    const req_data = [];
    this.commonPostCall(req_url, req_data).subscribe(
      data => {
        this.loaderService.display(false);
        if (data.status == 200) {
          this.deleteLocalConfig();
          this.redirectUser();
        }
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

  deleteLocalConfig(): void {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    this.alert.success(this.language.logout_success);
  }

  redirectUser() {
    if (this.userType == 1) {
      this.redirectToAdminLogin();
    } else if (this.mainRoute != 'login') {
      this.redirectToBarOwnerLogin();
    }
  }

  redirectToAdminLogin() {
    this.router.navigate(["/home"]);
  }

  checkLogin(type) {
    const userData: any = this.getUserData();
    const token = localStorage.getItem('token');
    if (userData != null && token != null && token != undefined && token != "") {
      if (userData.social_login == 0 && userData.profile_completed == 0 && userData.is_phone_verified == 0) {
        this.router.navigate(['/otp'])
      } else {
        if (type == true) {
          this.router.navigate(['business-valuation']);
        } else {
          this.redirectToAdminLogin()
        }
      }

    }
  }

  redirectToBarOwnerLogin() {
    this.router.navigate(["/login"]);
  }

  setLocalConfig(data): void {
    localStorage.setItem('userData', data.userData);
    localStorage.setItem('token', data.token);
  }

  setUserData(data): void {
    localStorage.setItem('userData', data);
  }



  getUserData(): void {
    const userData = localStorage.getItem('userData');
    if (userData != undefined && userData != "" && userData != null) {
      this.shareUserData(JSON.parse(userData));
      return JSON.parse(userData);
    }
  }
  getFileName(url) {
    return url.match(/.*\/(.*)$/)[1];
  }

  calculateMonth(d1, d2) {
    var diff = (d2.getTime() - d1.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7 * 4);
    return Math.abs(diff);
  }

  trackByData(index: number, data: any): string {
    if (data != null) {
      return data.id;
    }

  }


  setOptions(field) {
    return {
      displayKey: field, //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: this.language.select, // text to be displayed when no item is selected defaults to Select,
      searchPlaceholder: this.language.search, // label thats displayed in search input,
      searchOnKey: field, // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
      clearOnSelection: false, // clears search criteria when an option is selected if set to true, default is false
    }
  }

  setOptionsUserType(field) {
    return {
      displayKey: field, //if objects array passed which key to be displayed defaults to description
      // search: true, //true/false for the search functionlity defaults to false,
      height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      // placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
      // searchPlaceholder: 'Search', // label thats displayed in search input,
      // searchOnKey: field, // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
      clearOnSelection: false, // clears search criteria when an option is selected if set to true, default is false
    }
  }



  setLanguage(lang) {
    localStorage.setItem("langType", lang);
  }

  getLanguage() {
    return localStorage.getItem("langType") ? localStorage.getItem("langType") : 'en';
  }

  languageChange() {
    let lang = this.getLanguage() ? this.getLanguage() : 'en';
    if (lang == 'en')
      this.dataSource.next(configDataEn);
    else
      this.dataSource.next(configDataGer);
  }

  googleAnalytics(eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null) {
    // ga('send', 'event', { eventCategory, eventLabel, eventAction, eventValue });
  }

}
