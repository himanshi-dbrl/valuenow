import { Component, OnInit, Inject } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { DOCUMENT } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-inner-top-header',
  templateUrl: './inner-top-header.component.html',
  styleUrls: ['./inner-top-header.component.css']
})
export class InnerTopHeaderComponent implements OnInit {

  myDropdown: string = "myDropdown";
  language: any = [];
  currentlan: string;
  constructor(private commonService: CommonHttpService, @Inject(DOCUMENT) private document: Document) {
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
    this.currentlan = this.commonService.getLanguage();
    this.document.documentElement.lang = this.currentlan;
    this.setCSSLink(this.currentlan);
  }

  changeLanguage(val) {
    this.document.documentElement.lang = val;
    this.currentlan = val;
    this.commonService.setLanguage(val);
    this.commonService.languageChange();
    this.setCSSLink(val);
    location.reload();
  }

  setCSSLink(val) {
    var enUrl = './assets/css/bootstrap.min.css';
    var arUrl = 'https://cdn.rtlcss.com/bootstrap/v4.2.1/css/bootstrap.min.css';
    let canURL = val == 'en' ? enUrl : arUrl;
    let link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    this.document.head.appendChild(link);
    link.setAttribute('href', canURL);

  }

  ngOnInit() {
    $(document).ready(function () {
      $(".menu__extra--button").click(function () {
        $(".sidebar__nav").addClass("sidebar__nav--active");
        $('body').css({
          'position': 'relative'
        });
        $('.body-shadow').css({
          'z-index': '5',
          'background': 'rgba(0, 0, 0, .5)'
        });
      });
      $(".sidebar__close, .body-shadow").click(function () {
        $(".sidebar__nav").removeClass("sidebar__nav--active");
        $('.body-shadow').css({
          'z-index': '-1',
          'background': 'rgba(0, 0, 0, 0.0)'
        });
      });
    });
  }
}
