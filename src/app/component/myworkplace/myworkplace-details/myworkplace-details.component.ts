import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-myworkplace-details',
  templateUrl: './myworkplace-details.component.html',
  styleUrls: ['./myworkplace-details.component.css']
})
export class MyworkplaceDetailsComponent implements OnInit {

  data: any;
  profilePic: string = "assets/images/post_user/user1.png";
  userData: any;
  constructor(private googleAnalyticsService: GoogleAnalyticsService, private alert: AlertService, private loader: LoaderService, private commonService: CommonHttpService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("My Workplace details", "workplace details", "workplace", event.urlAfterRedirects, 12);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = { title: this.language.investor_workplace, description: this.language.investor_workplace + ' ' + this.language.with };
      },
      err => { }
    )

  }
  language: any = [];
  headerData: object;
  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.getList(id);
  }

  profileUrl(url) {
    return url != null ? this.commonService.siteUrl() + url : this.profilePic;
  }

  getList(id) {
    this.loader.display(true);
    const url = `workplace/${id}`;
    this.commonService.commonGetCall(url).subscribe(data => {
      this.data = data.data;
      this.loader.display(false);
    }, error => {
      this.loader.display(false);
    })
  }

  imageDataChange(data) {
    let image = [];
    let i = 0;
    data.forEach((element, index) => {
      if (element.file_type == 'pic' && i < 3) {
        i++;
        image.push(this.commonService.siteUrl() + element.url);
      }
    });
    return image;
  }

  modelSliderOpen(content) {
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
  }

}
