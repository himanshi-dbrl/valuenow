import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { LoaderService } from 'src/app/services/loader.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { Router } from '@angular/router';
import { error } from 'protractor';

@Component({
  selector: 'app-opportunities-list',
  templateUrl: './opportunities-list.component.html',
  styleUrls: ['./opportunities-list.component.css']
})
export class OpportunitiesListComponent implements OnInit {
  @Input() data: any;
  @Input() index: number;
  @Output() updateStatus = new EventEmitter<any>();
  @Output() removeUserPost = new EventEmitter<any>();
  @Input() capable: number;
  profilePicFemale: string = "assets/images/female.png";
  profilePicMale: string = "assets/images/male.png";
  closeResult: string;
  listData: Array<any> = [];
  sliderImg: any = [];
  postData: any;
  activeIndex: number;
  language: any = [];
  constructor(private modalService: NgbModal, private alert: AlertService, private loader: LoaderService, private commonService: CommonHttpService, private router: Router) {
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
  }

  ngOnInit() {

  }

  profileUrl(url, gender) {
    return url != null ? this.commonService.siteUrl() + url : gender == 1?this.profilePicMale:this.profilePicFemale;
  }

  edit(id) {
    this.router.navigate([`opportunity/edit/${id}`])
  }

  details(id) {
    this.router.navigate([`opportunity/details/${id}`]);
  }

  featureId(id, index) {
    if (this.capable == 0 || this.capable == 2) {
      this.alert.info(this.language.your_package_to_advanced);
      this.router.navigate(['business-valuation']);
    } else if (this.capable == 1) {
      this.alert.info(this.language.you_need_to_upgrade_your_package);
    } else {
      this.loader.display(true);
      const url = `feature/${id}`;
      this.commonService.commonPutCall(url, {}).subscribe(data => {
        this.updateStatus.emit(index);
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
  }


  deletePost(index) {
    const url = "deletepost";
    const reqData = { post_id: this.postData.id };
    this.loader.display(true);
    this.commonService.commonPostCall(url, reqData).subscribe(data => {
      if (data.status == 200) {
        this.alert.success(data.message);
        this.removeUserPost.emit(this.activeIndex);
        this.modalService.dismissAll();
      }
      this.loader.display(false);
    }, error => {
      this.alert.error(error.error ? error.error.message : this.language.server_not_responding);
      this.loader.display(false);
    });
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
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

  imageDataChange(images, imagesbusiness) {
    var data = images;
    if (imagesbusiness != undefined) {
      data = images.concat(imagesbusiness)
    }
    let image = [];
    let i = 0;
    data.forEach(element => {
      if (element.file_type == 'pic' && i < 3) {
        i++;
        image.push(this.commonService.siteUrl() + element.url);
      }
    });
    return image;
  }

  deleteOpenVerticallyCentered(content, data, index) {
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
    this.postData = data;
    this.activeIndex = index;
  }

  openVerticallyCentered(content, image, imagesbusiness) {
    this.sliderImg = [];
    var data = image;
    if (imagesbusiness != undefined) {
      data = image.concat(imagesbusiness)
    }
    data.forEach(element => {
      if (element.file_type == 'pic') {
        this.sliderImg.push(this.commonService.siteUrl() + element.url);
      }
    });
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
  }

}
