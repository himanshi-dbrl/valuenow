import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router, NavigationEnd } from '@angular/router';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 3000, noPause: false, showIndicators: true } }
  ]
})
export class HomeComponent implements OnInit {

  closeResult: string;
  userData: any;
  listData: any = [];
  progress: Array<any> = [];
  completedProgress: number;
  capable: number = 0;
  language: any = [];
  tokenIndex: number = 0;
  headerData: object = {};
  notFound: boolean = false;
  constructor(private googleAnalyticsService: GoogleAnalyticsService, private pushNotification: PushNotificationService, private modalService: NgbModal, private commonService: CommonHttpService, private alert: AlertService, private loader: LoaderService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("My Home", "my home", "my home", event.urlAfterRedirects, 10);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = { title: this.language.my_home, description: this.language.my_home };
      },
      err => { }
    )

    this.userData = this.commonService.getUserData();
    if (!this.userData.device_token) {
      this.updateDeviceToken();
    }
    this.commonService.userData.subscribe(data => {
      if (data != undefined || data != {}) {
        this.userData = data;
        if (this.tokenIndex == 0) {
          this.sendToken();
          this.tokenIndex++;
        }
      }
    });

    this.progress.push(this.checkFill(this.userData.first_name, ''));
    this.progress.push(this.checkFill(this.userData.last_name, ''));
    this.progress.push(this.checkFill(this.userData.dob, ''));
    this.progress.push(this.checkFill(this.userData.qualification, ''));
    this.progress.push(this.checkFill(this.userData.email, this.userData.email_verified_at));
    this.progress.push(this.checkFill(this.userData.phone_number, this.userData.is_phone_verified != 0 ? 1 : null));
    this.progress.push(this.checkFill(this.userData.gender, ''));
    this.progress.push(this.checkFill(this.userData.address, ''));
    this.progress.push(this.checkFill(this.userData.country, ''));
    this.progress.push(this.checkFill(this.userData.city, ''));
    this.progress.sort().reverse();
    this.completedProgress = this.progress.filter(s => { return s; }).length;
  }


  sendToken() {
    this.pushNotification.requestPermission().subscribe(token => {
      const data = { device_token: token };
      this.pushNotification.setToken(token);
      const url = 'updatedevicetoken';
      this.commonService.commonPostCall(url, data).subscribe(data => {
      })

    }, error => {
    });

  }


  updateDeviceToken() {
    const url = 'updatedevicetoken';
    var token = this.pushNotification.getToken();
    const data = { device_token: token };
    this.commonService.commonPostCall(url, data).subscribe(data => {
    }, error => {
    });

  }

  profileStatus() {
    return this.completedProgress < 4 ? this.language.weak : this.completedProgress > 3 && this.completedProgress < 6 ? this.language.intermidiate : this.language.strong;
  }

  checkFill(value, verified) {
    if (value && verified != '') {
      return value != null && value != "" && verified != null && verified != "" ? true : false;
    } else {
      return value != null && value != "" ? true : false
    }
  }

  ngOnInit() {
    this.getList();
    $(document).ready(function () {
      $('.StoriesSlider').slick({
        dots: false,
        prevArrow: $('.prev'),
        nextArrow: $('.next'),
        infinite: false,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }

        ]
      });
    });

  }



  updateStatus(data) {
    this.listData[data.index]['is_bookmarked'] = data.status;
  }


  goToSearch() {
    this.router.navigate(['/search-opportunity']);
  }



  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // this.closeResult = result;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
  }

  getList() {
    this.notFound = false;
    const url = "opportunitypost";
    this.loader.display(true);
    this.commonService.commonPostCall(url, {}).subscribe(data => {
      if (data.status == 200) {
        this.listData = data.data.post;
        this.capable = data.data.capable;
        this.listData.filter(element => {
          if (element.get_business == undefined) {
            element['get_business'] = element['get_workplace'];
            if(element['get_business']){
              element['get_business']['get_business_files'] = element['get_workplace']['get_files'];
            }
          }
        });
        this.notFound = false;
      } else {
        this.listData = [];
        this.notFound = true;
      }
      this.loader.display(false);
    }, error => {
      this.alert.error(error.error ? error.error.message : this.language.server_not_responding);
      this.loader.display(false);
      this.notFound = true;
    })
  }



}
