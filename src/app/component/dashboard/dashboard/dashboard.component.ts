import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AlertService } from 'src/app/services/alert.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  listData: any = [];
  userPost: any = [];
  closeResult: string;
  headerData: object = {}
  totalPage: number;
  page: number = 1;
  currentPage: number;
  userCurrentPage: number;
  userPostPage: number = 1;
  userTotalPage: number;
  capable: number = 0;
  capableForView: number = 0;
  notFound: boolean = false;
  language: any = [];
  constructor(private googleAnalyticsService: GoogleAnalyticsService, private modalService: NgbModal, private alert: AlertService, private loader: LoaderService, public commonService: CommonHttpService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("Dashboard", "dashboard", "dashboard", event.urlAfterRedirects, 3);
      }
    });
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = { title: this.language.my_dashboard, description: this.language.valuate_your_business_with };
      },
      err => { }
    )
  }

  ngOnInit() {
    this.getList(1);
  }


  userOnScroll() {
    if (this.userTotalPage > this.userPostPage && this.userPostPage == this.userCurrentPage) {
      this.userPostPage = this.userPostPage + 1;
      this.getSaveData(this.userPostPage);
    }
  }

  updateStatus(activeIndex) {
    this.userPost.forEach((element, index) => {
      if (activeIndex == index) {
        element.status = 1;
      } else {
        element.status = 0;
      }
    });
  }

  removeUserPost(index) {
    this.userPost.splice(index, 1);
  }

  getList(page) {
    this.notFound = false;
    this.userPostPage = page;
    const url = "listposts?page=" + this.userPostPage;
    this.loader.display(true);
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        const datas = data.data;
        this.userCurrentPage = datas.post.from;
        this.userTotalPage = datas.post.last_page;
        this.capable = datas.capable;
        if (this.userPostPage == 1) {
          this.userPost = datas.post.data;
        } else {
          this.userPost = this.userPost.concat([...datas.post.data]);
        }
        this.userPost.filter(element => {

          if (element.get_business == undefined) {
            element['get_business'] = element['get_workplace'];
            element['get_business']['get_business_files'] = element['get_workplace']['get_files'];
          }
        });
        this.notFound = false;
      } else {
        this.userPost = [];
        this.userCurrentPage = 1;
        this.userTotalPage = 1;
        this.userPostPage = 1;
        this.notFound = true;
      }
      this.loader.display(false);
    }, error => {
      this.alert.error(error.error ? error.error.message : this.language.server_not_responding);
      this.loader.display(false);
      this.notFound = true;
    })
  }



  onScroll() {
    if (this.totalPage > this.page && this.page == this.currentPage) {
      this.page = this.page + 1;
      this.getSaveData(this.page);
    }
  }

  getSaveData(page) {
    this.notFound = false;
    this.page = page;
    const url = "savedpostslist?page=" + this.page;
    this.loader.display(true);
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        const datas = data.data;
        this.currentPage = datas.post.from;
        this.totalPage = datas.post.last_page;
        this.capableForView = datas.capable;
        if (this.page == 1) {
          this.listData = datas.post.data;
        } else {
          this.listData = this.listData.concat([...datas.post.data]);
        }
        this.listData.filter(element => {
          if (element.get_business == undefined) {
            element['get_business'] = element['get_workplace'];
            element['get_business']['get_business_files'] = element['get_workplace']['get_files'];
          }
        });
        this.notFound = false;
      } else {
        this.listData = [];
        this.currentPage = 1;
        this.totalPage = 1;
        this.page = 1;
        this.notFound = true;
      }
      this.loader.display(false);
    }, error => {
      this.notFound = true;
      this.alert.error(error.error ? error.error.message : this.language.server_not_responding);
      this.loader.display(false);
    })
  }

  removeBookmarkStatus(data) {
    // this.listData[data.index] = data.status;
    console.log(data);
    this.listData.splice(data.index, 1);
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

  openVerticallyCentered(content) {
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
  }

}
