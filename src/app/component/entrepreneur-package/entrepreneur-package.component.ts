import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoaderService } from 'src/app/services/loader.service';
import { BusinessValuationComponent } from '../business-valuation/business-valuation/business-valuation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
declare let ga: Function; // Declare ga as a function

@Component({
  selector: 'app-entrepreneur-package',
  templateUrl: './entrepreneur-package.component.html',
  styleUrls: ['./entrepreneur-package.component.css']
})
export class EntrepreneurPackageComponent implements OnInit {
  entrepreneurPlan: any = [];
  currentPackage: any = [];
  upgradePckgData: any = [];
  userData: any = [];
  language: any = [];
  freePlan: boolean = false;
  isActivePlan: boolean = false;
  constructor(private loader: LoaderService, private alert: AlertService, private commonService: CommonHttpService, private router: Router, private route: ActivatedRoute, protected modalService: NgbModal, private googleAnalyticsService: GoogleAnalyticsService) {
    this.commonService.userData.subscribe(data => {
      this.userData = data;
    });
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;

      },
      err => { }
    )
  }

  // @ViewChild(BusinessValuationComponent, { static: false }) businessValuation: BusinessValuationComponent;


  upgradePackage(content, data) {
    this.upgradePckgData = [];
    this.upgradePckgData = data;
    this.openModal(content);
  }

  openModal(content) {
    this.modalService.open(content, { windowClass: 'modal-holder', centered: true });
  }
  ngOnInit() {
    this.getEntrepreneurPackates();
  }

  getEntrepreneurPackates() {
    this.loader.display(true);
    const url = "packages/entrepreneur";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.entrepreneurPlan = data.data.packages;
      this.currentPackage = data.data.currentPackage;
      var d1 = new Date();
      var isPackage = false;
      var activePackageIndex;
      if (this.currentPackage != null && this.currentPackage.get_package_entrepreneur != null) {
        var packageInfo = this.currentPackage.get_package_entrepreneur;
        var d2 = new Date(this.currentPackage.updated_at);
        var months = this.commonService.calculateMonth(d1, d2);
        if (this.currentPackage.amount == 0 || this.currentPackage.amount == 'Open') {
          isPackage = true;
          this.freePlan = true;
        }
        if (packageInfo.duration >= months) {
          isPackage = true;
          this.freePlan = false;
        }
        this.isActivePlan = isPackage;

        if (isPackage == true) {
          this.entrepreneurPlan.forEach((element, index) => {
            if (element.id == packageInfo.id) {
              activePackageIndex = index;
            }
          });
        }
      }
      this.entrepreneurPlan.forEach(element => {
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
    });
  }

  downgrade() {
    this.alert.info(this.language.downgrade_purchage);
  }

  purchagePackage(data) {
    this.loader.display(true);
    const req = { 'amount': data.amount, 'package_id': data.id, package_type: 1, description: 'Investor package' };
    const url = 'makepayment';
    this.commonService.commonPostCall(url, req).subscribe(data => {
      if (data.status_code == 200) {
        if (data.data.url != undefined) {
          window.location.href = data.data.url;
          var type = this.userData.type == 1 ? 'Entrepreneur ' : 'Investor';
          this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
              this
                .googleAnalyticsService
                .eventEmitter("Entrepreneur package with " + type, type, "entrepreneur package", event.urlAfterRedirects, 28);
            }
          });
        } else {
          window.location.reload()
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
        this.alert.error(error.error ? error.error.message : this.language.server_not_responding);
      }
    });

  }

}
