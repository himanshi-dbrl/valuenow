import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-myworkplace-list',
  templateUrl: './myworkplace-list.component.html',
  styleUrls: ['./myworkplace-list.component.css']
})
export class MyworkplaceListComponent implements OnInit {

  closeResult: string;
  listData: Array<any> = [];
  sliderImg: any = [];
  workplace: any;
  business_id: any;
  activeIndex: number;
  profilePicFemale: string = "assets/images/female.png";
  profilePicMale: string = "assets/images/male.png";
  headerData: object;
  language: any = [];
  userData: any;
  constructor(private googleAnalyticsService: GoogleAnalyticsService, private modalService: NgbModal, public commonService: CommonHttpService, private loader: LoaderService, private alert: AlertService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("My Workplace List", "workplace list", "workplace", event.urlAfterRedirects, 13);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = { title: this.language.investor_workplace, description: '' };
      },
      err => { }
    )

    this.getList();
  }

  ngOnInit() {
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

  deletePost(id) {
    const url = "workplace/" + this.workplace.id;
    this.loader.display(true);
    this.commonService.commonDeleteCall(url, {}).subscribe(data => {
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
    this.workplace = data;
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
    const url = "workplace";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.listData = data.data;
      this.loader.display(false);
    }, error => {
      this.loader.display(false);
    })
  }

  edit(id) {
    this.router.navigate([`/workplace/edit/${id}`]);
  }

  details(id) {
    this.router.navigate([`/workplace/details/${id}`]);
  }


}
