import { Component, OnInit, Inject } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { ThrowStmt } from '@angular/compiler';
import { AuthService } from 'angularx-social-login';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.css']
})
export class TopHeaderComponent implements OnInit {

  userData: any = [];
  myDropdown: string = "myDropdown";
  language: any = [];
  currentlan: any = 'en';
  constructor(private commonService: CommonHttpService, private router: Router, @Inject(DOCUMENT) private document: Document) {
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
    this.currentlan = val;
    this.commonService.setLanguage(val);
    this.commonService.languageChange();
    this.setCSSLink(val);
    window.location.reload();
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






  signOut(): void {
    this.commonService.deleteLocalConfig();
    this.router.navigate(["login"]);

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
