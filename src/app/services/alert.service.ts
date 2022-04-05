import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { configData as configDataEn } from '../../json/strings_en';
import { configData as configDataGer } from '../../json/strings_ger';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  dataLanguage: any = this.getLanguage() == 'en' || "" ? configDataEn : configDataGer;
  private dataSource = new BehaviorSubject<any>(this.dataLanguage);
  languageData = this.dataSource.asObservable();
  language: any = [];
  constructor(private toastr: ToastrService) {
    this.languageChange();
    this.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
  }
  stayTime = {
    timeOut: 3000
  };


  languageChange() {
    let lang = this.getLanguage() ? this.getLanguage() : 'en';
    if (lang == 'en')
      this.dataSource.next(configDataEn);
    else
      this.dataSource.next(configDataGer);
  }

  setLanguage(lang) {
    localStorage.setItem("langType", lang);
  }

  getLanguage() {
    return localStorage.getItem("langType") ? localStorage.getItem("langType") : 'en';
  }

  success(message: string) {
    this.toastr.success(message, this.language.success, this.stayTime);
  }

  error(message: string) {
    this.toastr.error(message, this.language.error, this.stayTime);
  }

  info(message: string) {
    this.toastr.info(message, this.language.info, this.stayTime);
  }

  warning(message: string) {
    this.toastr.warning(message, this.language.warning, this.stayTime);
  }
}
