import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { LoaderService } from 'src/app/services/loader.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-post-opportunity-details',
  templateUrl: './post-opportunity-details.component.html',
  styleUrls: ['./post-opportunity-details.component.css']
})
export class PostOpportunityDetailsComponent implements OnInit {

  data: any;
  profilePicFemale: string = "assets/images/female.png";
  profilePicMale: string = "assets/images/male.png";
  userData: any = [];
  zipUrl: string = "";
  language: any = [];
  isChat: number = 0;

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private alert: AlertService, private loader: LoaderService, private commonService: CommonHttpService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("Post Opportunity Details", "post opportunity details", "opportunity", event.urlAfterRedirects, 18);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = {
          title: this.language.post_opportunity, description: this.language.post_opportunity + ' ' + this.language.with
        }
      },
      err => { }
    )

    this.userData = this.commonService.getUserData();
  }
  headerData: object;
  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.getList(id);
  }

  profileUrl(url, gender) {
    return url != null ? this.commonService.siteUrl() + url : gender == 1 ? this.profilePicMale : this.profilePicFemale;
  }

  downloadZip(id) {
    return;
    this.loader.display(true);
    const url = "download-zip";
    const req = { post_id: id };
    this.commonService.commonPostCall(url, req).subscribe(data => {
      if (data.status == 200) {
        console.log(data.data);
      }
      this.loader.display(false);
    }, error => {
      this.alert.error(error.message);
      this.loader.display(false);
    })
  }

  bookmark(status, id) {
    this.loader.display(true);
    const url = status == 0 ? 'unBookmark' : 'bookmark';
    const req = { status: status, post_id: id, user_id: this.userData.id };
    this.commonService.commonPostCall(url, req).subscribe(data => {
      if (data.status == 200) {
        this.data['is_bookmarked'] = status;
        this.alert.success(data.message);
      } else {
        this.alert.error(data.message);
      }
      this.loader.display(false);
    }, error => {
      this.alert.error(error.message);
      this.loader.display(false);
    });
  }

  getList(id) {
    this.loader.display(true);
    const url = `getpostDetails/${id}`;
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.data = data.data;
        this.isChat = data.is_chat;

        if (this.data['get_business'] == null && this.data['get_workplace'] == undefined) {
          this.router.navigate(['/dashboard']);
        }
        if (this.data['get_business'] == undefined && this.data['get_workplace'] == null) {
          this.router.navigate(['/dashboard'])
        }
        if (this.data['get_workplace'] != undefined && this.data['get_workplace'] != null) {
          this.data['get_business'] = this.data['get_workplace'];
          this.data['get_business']['get_business_files'] = this.data['get_workplace']['get_files'];
        }

      } else {
        this.router.navigate(['/dashboard']);
      }

      this.loader.display(false);
    }, error => {
      this.loader.display(false);
    })
  }

  imageDataChange(images, imagesbusiness, type) {
    let image = [];
    var data = images;
    if (imagesbusiness != undefined) {
      data = images.concat(imagesbusiness);
    }
    data.forEach(element => {
      if (element.file_type == type) {
        image.push(this.commonService.siteUrl() + element.url);
      }
    });
    return image;
  }

  modelSliderOpen(content) {
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
  }

  openChatModule(content) {
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
  }

  chats() {
    this.router.navigate([`chat`]);
  }

  sayHiMessage() {
    this.loader.display(true);
    const Url = 'sayHiMessage';
    const data = { post_user_id: this.data.post_user_id };
    this.commonService.commonPostCall(Url, data).subscribe(data => {
      this.loader.display(false);
      if (data.status == 200) {
        this.chats();
      }
    }, error => {
      this.loader.display(false);
    });
  }


}
