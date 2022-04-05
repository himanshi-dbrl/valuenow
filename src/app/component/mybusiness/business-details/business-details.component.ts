import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { LoaderService } from '../../../services/loader.service';
import { CommonHttpService } from '../../../services/common-http.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
declare let ga: Function; // Declare ga as a function

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.css']
})
export class BusinessDetailsComponent implements OnInit {
  data: any;
  profilePicFemale: string = "assets/images/female.png";
  profilePicMale: string = "assets/images/male.png";
  userData: any;
  language: any;
  constructor(private googleAnalyticsService: GoogleAnalyticsService, private alert: AlertService, private loader: LoaderService, private commonService: CommonHttpService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("Business Details", "business details", "business details", event.urlAfterRedirects, 8);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = {
          title: this.language.my_business, description: this.language.my_business + ' ' + this.language.with
        }
      },
      err => { }
    )

  }
  headerData: object;
  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.getList(id);
  }

  profileUrl(url, gender) {
    return url != null ? this.commonService.siteUrl() + url : gender == 1 ? this.profilePicMale : this.profilePicFemale;
  }

  getList(id) {
    this.loader.display(true);
    const url = `getBusinessDetails/${id}`;
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
