import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { LoaderService } from '../../../services/loader.service';
import { AlertService } from '../../../services/alert.service';
import { CommonHttpService } from '../../../services/common-http.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
declare var $: any;


@Component({
  selector: 'app-business-valuation',
  templateUrl: './business-valuation.component.html',
  styleUrls: ['./business-valuation.component.css']
})
export class BusinessValuationComponent implements OnInit {

  public exampleData: Array<Select2OptionData>;
  public options: Options;
  public business: any;
  businessValuatedPlan: any = [];
  BusinessNameConfig: any;
  selectData: any;
  valuationForm: FormGroup;
  business_id: any;
  value: any;
  userData: any = [];
  businessPackage: any = [];
  public upgradePckgData: any = [];
  language: any = [];
  headerData: object;

  constructor(private loader: LoaderService, private alert: AlertService, private commonService: CommonHttpService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, protected modalService: NgbModal, private googleAnalyticsService: GoogleAnalyticsService) {


    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("Business valuation", "businsess valuation", "businsess valuation", event.urlAfterRedirects, 1);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = { title: this.language.business_valuation, description: this.language.valuate_your_business_with };
      },
      err => { }
    )

    this.BusinessNameConfig = this.commonService.setOptions("business_name");
    this.commonService.userData.subscribe(data => {
      this.userData = data;
    });
  }

  formBuild() {
    this.valuationForm = this.formBuilder.group({
      business_name: ['']
    })
  }

  get f() {
    return this.valuationForm.controls;
  }

  ngOnInit() {
    if (this.userData.type == 1) {
      this.formBuild();
      this.business_id = this.route.snapshot.paramMap.get('id');
      if (this.business_id) {
        this.getBusinessPackage();
      }
      this.getBusinessValuatedPackates();
    }

    $(document).ready(function () {
      $('.businessSlider').slick({
        dots: true,
        customPaging: function (slider, i) {
          return '<span class="dot"></span>';
        },
        infinite: true,
        prevArrow: $('.prevSlider'),
        nextArrow: $('.nextSlider'),
        speed: 500,
        fade: true,
        cssEase: 'linear'
      });
    });
  }

  sortBusiness() {
    this.business.sort((a, b) => (a.business_name > b.business_name) ? 1 : -1);
  }

  getList() {
    this.loader.display(true);
    const url = "businesslist";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.business = data.data;
      this.sortBusiness();
      let check = false;
      this.business.filter(data => {
        if (data.id == this.business_id) {
          check = true;
          this.selectData = data;
          this.valuationForm.patchValue({
            business_name: this.selectData
          })
        }
      });
      if (!check) {
        this.business_id = undefined;
      }
      this.loader.display(false);
    }, error => {
      this.loader.display(false);
    });
  }

  additionalChargeAdd(value, amount, i) {
    this.businessValuatedPlan[i].amount = value == true ? parseInt(this.businessValuatedPlan[i].amount) + parseInt(amount) : this.businessValuatedPlan[i].amount - parseInt(amount);
  }

  getBusinessValuatedPackates() {
    this.loader.display(true);
    const url = "packages/businessEvaluation";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.businessValuatedPlan = data.data.packages;
      let check = false;
      this.business = data.data.business;
      this.sortBusiness();
      this.business.filter(data => {
        if (data.id == this.business_id) {
          check = true;
          this.selectData = data;
          this.valuationForm.patchValue({
            business_name: this.selectData
          })
        }
      });
      if (!check) {
        this.business_id = undefined;
      }
      this.loader.display(false);
    }, error => {
      this.loader.display(false);
    });
  }

  upgradePackage(content, data) {
    this.upgradePckgData = [];
    this.upgradePckgData = data;
    this.openModal(content);
  }

  openModal(content) {
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
  }



  purchagePackage(data) {
    if (this.business_id != undefined) {
      this.loader.display(true);
      const req = { business_id: this.business_id, amount: data.amount, package_id: data.id, package_type: 3, description: 'Business Valuation package' };
      const url = 'makepayment';
      this.commonService.commonPostCall(url, req).subscribe(res => {
        if (res.status_code == 200) {
          if (data.amount > 0) {
            window.location.href = res.data.url;
            var type = this.userData.type == 1 ? 'Entrepreneur ' : 'Investor';
            this.router.events.subscribe(event => {
              if (event instanceof NavigationEnd) {
                this
                  .googleAnalyticsService
                  .eventEmitter("Business valuation with " + type, type, "business valuate", event.urlAfterRedirects, 25);
              }
            });
          } else {
            this.alert.success(data.message);
          }
        } else {
          this.alert.info(data.message);
        }
        this.loader.display(false);
      }, error => {
        this.loader.display(false);
        if (typeof error == 'string') {
          this.alert.info(error);
        } else {
          this.alert.error(this.language.server_not_responding);
        }
      });
    } else {
      this.alert.info(this.language.select_a_vailed_business);
    }
  }

  downgrade() {
    this.alert.info(this.language.downgrade_purchage);
  }

  selectBusiness(data) {
    if (data != null && data.value != null && this.business.length > 0) {

      this.business_id = data.value.id;
      this.getBusinessPackage();
    } else {
      this.alert.info(this.language.select_a_vailed_business);
    }
  }

  getBusinessPackage() {
    this.loader.display(true);
    const url = `packages/businessPackage/${this.business_id}`;
    this.commonService.commonGetCall(url).subscribe(data => {
      this.businessPackage = data.data;
      var d1 = new Date();
      var isPackage = false;
      var activePackageIndex;
      if (this.businessPackage != null && this.businessPackage.get_payment != null) {
        var paymentInfo = this.businessPackage.get_payment;
        var packageInfo = paymentInfo.get_package;
        var d2 = new Date(paymentInfo.updated_at);
        var months = this.commonService.calculateMonth(d1, d2);
        if (paymentInfo.amount == 0 || paymentInfo.amount == 'Open') {
          isPackage = true;
        }
        if (packageInfo.duration >= months) {
          isPackage = true;
        }

        if (isPackage == true) {
          this.businessValuatedPlan.forEach((element, index) => {
            if (element.id == packageInfo.id) {
              activePackageIndex = index;
            }
          });
        }
      }
      this.businessValuatedPlan.forEach(element => {
        element['isUse'] = activePackageIndex;
        if (isPackage == true && element.id == packageInfo.id) {
          element['isPackage'] = true;
        } else {
          element['isPackage'] = false;
        }
      });
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
