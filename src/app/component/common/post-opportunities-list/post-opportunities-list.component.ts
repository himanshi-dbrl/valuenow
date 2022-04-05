import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertService } from 'src/app/services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post-opportunities-list',
  templateUrl: './post-opportunities-list.component.html',
  styleUrls: ['./post-opportunities-list.component.css']
})
export class PostOpportunitiesListComponent implements OnInit {
  @Input() data: any;
  @Input() page: string;
  @Input() index: number;
  @Output() updateStatus = new EventEmitter<any>();
  @Input() capable: number;
  profilePicFemale: string = "assets/images/female.png";
  profilePicMale: string = "assets/images/male.png";
  closeResult: string;
  sliderImg: any = [];
  activeIndex: number;
  userData: any = [];
  language: any = [];
  isProfileCompleted: boolean = false;
  constructor(private modalService: NgbModal, private alert: AlertService, private loader: LoaderService, private commonService: CommonHttpService, private router: Router) {
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
    this.userData = this.commonService.getUserData();
    this.isProfileCompleted = this.userData.profile_completed == 1 ? true : false;
  }

  ngOnInit() {

  }

  details(data) {
    if (data.get_post_views != null || this.capable == 3) {
      this.router.navigate([`/opportunity/details/${data.id}`]);
    } else if ((this.capable == 0 || this.capable == 2)) {
      this.router.navigate(['business-valuation']);
      this.alert.info(this.language.suitable_package);
    } else if (this.capable == 1) {
      this.alert.info(this.language.you_need_to_upgrade_your_package);
    } else {
      this.router.navigate([`/opportunity/details/${data.id}`]);
    }
  }

  profileUrl(url, gender) {
    return url != null ? this.commonService.siteUrl() + url : gender == 1?this.profilePicMale:this.profilePicFemale;
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
    // this.sliderImg.push(this. + data);
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
  }

  bookmark(data, index) {
    this.loader.display(true);
    var status = data.is_bookmarked == 1 ? 0 : 1;
    const url = status == 0 ? 'unBookmark' : 'bookmark';
    const req = { post_id: data.id, user_id: this.userData.id };
    this.commonService.commonPostCall(url, req).subscribe(data => {
      if (data.status = 200) {
        this.data['is_bookmarked'] = data.is_bookmarked == 1 ? 0 : 1;
        this.updateStatusData(index, status);
        if (this.language.typeOf == "1") {
          this.alert.success(data.message);
        } else if (this.language.typeOf == "2") {
          this.alert.success(data.message_ar);
        }
      } else {
       if (this.language.typeOf == "1") {
        this.alert.error(data.message);
      } else if (this.language.typeOf == "2") {
        this.alert.error(data.message);
      }
      }
      this.loader.display(false);
    }, error => {
      this.alert.error(error.message);
      this.loader.display(false);
    });
  }

  updateStatusData(index, status) {
    this.updateStatus.emit({ index: index, status: status });
  }

}
