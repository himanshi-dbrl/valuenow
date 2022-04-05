import { Component, OnInit } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  datas: any = [];
  language: any = [];
  headerData: object;
  constructor(private googleAnalyticsService: GoogleAnalyticsService, protected commonService: CommonHttpService, private alert: AlertService, private loader: LoaderService, private router: Router) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("Notification List", "notification list", "notification", event.urlAfterRedirects, 14);
      }
    });
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = { title: this.language.notification, description: '' };
      },
      err => { }
    )


  }

  ngOnInit() {
    this.getData();

  }

  getData() {
    const url = 'getNotification';
    this.loader.display(true);
    this.commonService.commonGetCall(url).subscribe(data => {
      this.datas = data.data;
      localStorage.setItem('notification_date', data.date);
      this.loader.display(false);
    }, error => {
      if (typeof error == 'string') {
        this.alert.info(error);
      } else {
        this.alert.error(this.language.server_not_responding);
      }
      this.loader.display(false);
    });
  }

  addTime(dates) {
    var dateTime = new Date(dates);
    return dateTime.setHours(dateTime.getHours() + 3);
  }





  post(id) {
    this.router.navigate([`opportunity/details/${id}`])
  }

}
