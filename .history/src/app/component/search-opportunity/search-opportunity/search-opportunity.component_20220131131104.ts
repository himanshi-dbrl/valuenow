import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Options } from 'select2';
import { AlertService } from 'src/app/services/alert.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-search-opportunity',
  templateUrl: './search-opportunity.component.html',
  styleUrls: ['./search-opportunity.component.css']
})
export class SearchOpportunityComponent implements OnInit {

  submitted: boolean = false;
  closeResult: string;
  colorTheme = 'theme-dark-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  fconfig: any;
  fbconfig: any;
  fieldconfig:any;
  options: Options;
  business: any;
  opportunity: any;
  optional: any;
  businessType: any;
  country: any;
  rangeInvestment: any;
  config: any;
  countryConfig: any;
  configEmployeeName: any;
  listData: any = [];
  page: number = 1;
  headerData: object;
  rangeOfInvestment: any = []
  fieldData: any = [];
  subFieldData: any = [];
  numberofEmployess: any = [];
  investingAsList: Array<any> = [];
  selectSubField: number;
  userData: any = [];
  searchPostForm: FormGroup;
  userType: any = 1;
  totalData: number = 50;
  per_page: number;
  totalPage: number;
  currentPage: number;
  capable: number = 0;
  language: any = [];
  notFound: boolean = false;
  postDatas: any = [];
  position: number = 4;
  counter: number = 0;
  sortBy: number = 1;

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private router: Router, private modalService: NgbModal, public commonService: CommonHttpService, private loader: LoaderService, private alert: AlertService, private formBuilder: FormBuilder) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("Search Opportunity", "search opportunity", "search opportunity", event.urlAfterRedirects, 22);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = {
          title: this.language.search_opportunity, description: this.language.search_opportunity + ' ' + this.language.with
        };
      },
      err => { }
    )

    this.userData = this.commonService.getUserData();
    this.userType = this.userData.type;
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, isAnimated: true, showWeekNumbers: false });
    this.config = this.commonService.setOptions("name");
    // if (this.language.typeOf == "1") {
    //   this.fconfig = this.commonService.setOptions("name");
    // } else if (this.language.typeOf == "2") {
    //   this.fconfig = this.commonService.setOptions("ar_name");
    // }
    if (this.language.typeOf == "1") {
      this.countryConfig = this.commonService.setOptions("country_name");
      this.fieldconfig= this.commonService.setOptions("name");
      this.fconfig = this.commonService.setOptions("name");
      this.fbconfig = this.commonService.setOptions("name");
    } else if (this.language.typeOf == "2") {
      this.countryConfig = this.commonService.setOptions("arCountry_name");
      this.fieldconfig= this.commonService.setOptions("ar_name");
      this.fconfig = this.commonService.setOptions("ar_name");
      this.fbconfig = this.commonService.setOptions("ar_name");
    }
    // this.fconfig = this.commonService.setOptions("name");
    // this.fbconfig = this.commonService.setOptions("name");
    // this.fieldconfig= this.commonService.setOptions("name");
  //  this.countryConfig = this.commonService.setOptions("country_name");
    this.configEmployeeName = this.commonService.setOptions("employeeName");
    this.commonService.userData.subscribe(data => {
      this.userData = data;
      if (this.userData) {
        this.userType = this.userData.type;
      }
    })

    this.userData.type == 2 ? this.getBusinessType() : this.getInvestingAsList();
    this.getrangeInvestment();
    this.getField();
    this.getCountryList();
    this.getNumberofEmployees();
    this.getBusinessType()
  }

  buildForm() {

    var validationField = {
      field: [''],
      subField: [''],
      country: ['']
    };
    if (this.userType == 2) {
      validationField['employees'] = [''];
      validationField['estb_year'] = [''];
      validationField['estimated_business_value'] = [''];
      validationField['business_type'] = [''];
    } else {
      validationField['invest_as'] = [''];
      validationField['range'] = [''];
      validationField['dateOfPost'] = [''];
      validationField['business_type'] = [''];
    }

    this.searchPostForm = this.formBuilder.group(validationField);

  }

  get f() {
    return this.searchPostForm.controls;
  }


  ngOnInit() {
    this.buildForm();
    this.search(false);
  }

  onScroll() {
    if (this.totalPage > this.page && this.page == this.currentPage) {
      this.page = this.page + 1;
      this.search(false);
    }
  }

  filterSortBy(value) {
    this.sortBy = value;
    this.search(true);
  }


  search(newReq) {
    if (newReq) {
      this.page = 1;
      this.listData = [];
    }
    const reqData = this.searchPostForm.value;
    var req = {};
    req['filter'] = this.sortBy;
    const values = Object.values(reqData);
    const keys = Object.keys(reqData);
    values.forEach((element, index) => {
      if (element != "") {
        if (typeof element === 'object') {
          if (keys[index] == 'dateOfPost') {
            req['from_date'] = element[0].getDate() + '-' + (parseInt(element[0].getMonth()) + parseInt('1')) + '-' + element[0].getFullYear();
            req['to_date'] = element[1].getDate() + '-' + (parseInt(element[1].getMonth()) + parseInt('1')) + '-' + element[1].getFullYear();
          } else {
            req[keys[index]] = element['id'];
          }
        } else {
          req[keys[index]] = element;
        }

      }
    });
    this.getPostData(req);
  }

  getPostData(req) {
    this.notFound = false;
    this.loader.display(true);
    const url = "serachOpportunity?page=" + this.page;
    this.commonService.commonPostCall(url, req).subscribe(data => {
      this.loader.display(false);
      if (data.status == 200) { 
        const datas = data.data; 
      
        this.capable = datas.capable; 
        this.per_page = datas.post.per_page;
        this.currentPage = datas.post.from;
        this.totalPage = datas.post.last_page;
        this.postDatas = datas.post.data;
        var bannerData = datas.bannerData.data;
       
        this.postDatas.filter((datas, index) => {
          // if ((this.userData.type == 1 && (bannerData.length <= ((((index + 1) / this.position) - 1)) || (index == 0 || (index % this.position)) != 0))) {
          //   datas['get_business'] = datas['get_workplace'];
          //   datas['get_business']['get_business_files'] = datas['get_workplace']['get_files'];
          // }
          if (index != 0 && (index + 1) % this.position == 0) {
            var newIndex = (((index + 1) / this.position) - 1);
            var pushIndex: number = (index + 1) + (((index + 1) / this.position) - 1);
            if (bannerData.length > newIndex) {
              this.postDatas.splice((index + 1) + (((index + 1) / this.position) - 1), 0, bannerData[newIndex]);
            }
          }
        });
        if (this.page == 1) {
          this.listData = this.postDatas;
        } else {
          this.listData = this.listData.concat([...this.postDatas]);
        }
        console.log('listdata',this.listData)
        this.notFound = false;
      } else {
        this.page = 1;
        this.per_page = 1;
        this.currentPage = 1;
        this.totalPage = 0;
        this.listData = [];
        this.notFound = true;
      }
    }, error => {
      this.loader.display(false);
      this.notFound = true;
    });
  }


  getBusinessType() {
    this.loader.display(true);
    const url = "BusinessType";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.loader.display(false);
      this.businessType = data.data.list;
    }, error => {
      this.loader.display(false);
    }
    )
  }

  sortData() {
    this.listData.sort((a, b) => {
      if (a.title == undefined && b.title == undefined) {
        return a.id - b.id;
      }
    })
  }



  getrangeInvestment() {
    this.loader.display(true);
    const url = 'rangeInvestment';
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.rangeOfInvestment = data.data.list;
      }
      this.loader.display(false);
    }, error => {
      this.loader.display(false);
    })
  }

  getField() {
    this.loader.display(true);
    const url = 'fieldList';
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.fieldData = data.data.list;
      }
      this.loader.display(false);
    }, error => {
      this.loader.display(false);
    })
  }

  updateStatus(data) {
    this.listData[data.index]['is_bookmarked'] = data.status;
  }

  getSubfield(value) {
    if (value) {
      this.loader.display(true);
      const url = 'fieldList';
      this.commonService.commonGetWidthIdCall(url, value.id).subscribe(data => {
        this.subFieldData = data.data.list.subfield != null ? data.data.list.subfield : [];

        if (this.selectSubField != null && this.selectSubField > 0 && this.subFieldData != undefined) {
          this.searchPostForm.patchValue({
            subField: this.findField(this.subFieldData, this.selectSubField)
          })
        } else {
          this.searchPostForm.patchValue({
            subField: ''
          })
        }

        this.loader.display(false);
      }, error => {
        this.loader.display(false);
      })
    }

  }

  getCountryList() {
    this.loader.display(true);
    const url = "countrylist";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.loader.display(false);
      this.country = [...data.data.list];
    }, error => {
      this.loader.display(false);
    });
  }


  getNumberofEmployees() {
    this.loader.display(true);
    const url = 'NumberOfEmployees';
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.numberofEmployess = data.data.list;
      }
      this.loader.display(false);
      return;
    }, error => {
      this.loader.display(false);
    })
  }


  findField(findData, value) {
    var data;
    findData.forEach(element => {
      if (element.id == value) {
        data = element;
      }
    });
    return data;
  }


  getInvestingAsList() {
    this.loader.display(true);
    const url = "investingAs";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.investingAsList = data.data.list;
      this.loader.display(false);
    }, error => {
      this.loader.display(false);
    });
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




}
