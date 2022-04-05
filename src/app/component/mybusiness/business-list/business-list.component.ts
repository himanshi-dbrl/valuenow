import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
declare let ga: Function; // Declare ga as a function

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {
  closeResult: string;
  listData: Array<any> = [];
  sliderImg: any = [];
  business: any;
  business_id: any;
  activeIndex: number;
  profilePicFemale: string = "assets/images/female.png";
  profilePicMale: string = "assets/images/male.png";
  headerData: object = {};
  userData: any;
  language: any = [];
  changeText: boolean = false;

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private modalService: NgbModal, public commonService: CommonHttpService, private loader: LoaderService, private alert: AlertService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("Business List", "business list", "business list", event.urlAfterRedirects, 9);
      }
    });
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = { title: this.language.my_business, description: '' };
      },
      err => { }
    )

    this.getList();
  }

  ngOnInit() {
  }

  checkRestriction(data) {
    var d1 = new Date();
    if (data != null && data.get_payment != null) {
      var paymentInfo = data.get_payment;
      var packageInfo = paymentInfo.get_package;
      var d2 = new Date(paymentInfo.updated_at);
      var months = this.commonService.calculateMonth(d1, d2);
      if (packageInfo.duration >= months) {
        return true;
      }
      return false;
    }
    return true;
  }

  revisionBusiness(data, index) {
    if ((data.get_payment.get_package.number_of_update - data.no_of_update) <= 0) {
      this.alert.info(this.language.upgrade_your_package);
      return;
    }
    this.loader.display(true);
    const url = `revisionUpdate/${data.id}`;
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.listData[index].no_of_update = data.data.no_of_update;
      }
      this.loader.display(false);
    }, error => {
      this.loader.display(false);
      if (typeof error == 'string') {
        this.alert.info(error);
      } else {
        this.alert.error(this.language.server_not_responding);
      }
    })
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

  profileUrl(url, gender) {
    return url != null ? this.commonService.siteUrl() + url : gender == 1 ? this.profilePicMale : this.profilePicFemale;
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

  deletePost() {
    const url = "deletebusiness";
    const reqData = { business_id: this.business.id };
    this.loader.display(true);

    this.commonService.commonPostCall(url, reqData).subscribe(data => {
      if (data.status == 200) {
        this.alert.success(data.message);
        this.listData.splice(this.activeIndex, 1);
        this.modalService.dismissAll();
      }
      this.loader.display(false);
    }, error => {
      this.alert.error(error.error ? error.error.message : this.language.server_not_responding);
      this.loader.display(false);
    });
  }

  deleteOpenVerticallyCentered(content, data, index) {
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
    this.business = data;
    this.activeIndex = index;
  }

  openVerticallyCentered(content, images) {
    this.sliderImg = [];
    images.forEach(element => {
      if (element.file_type == 'pic') {
        this.sliderImg.push(this.commonService.siteUrl() + element.url);
      }
    });
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
  }

  getList() {
    this.loader.display(true);
    const url = "businesslist";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.listData = data.data;
      this.loader.display(false);
    }, error => {
      this.loader.display(false);
    })
  }

  edit(id) {
    this.router.navigate([`/business/edit/${id}`]);
  }

  details(id) {
    this.router.navigate([`/business/details/${id}`]);
  }


}
