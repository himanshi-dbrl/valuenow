import { Component, OnInit } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Select2OptionData } from 'ng-select2';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  userData: any = [];
  otpForm: FormGroup;
  submitted: boolean = false;
  resendSubmitted: boolean = false;
  isDisabled: boolean = true;
  closeResult: string;
  selectCountryCode: number;
  configCountryCode: any;
  edit: string;
  ok: string;
  language: any = [];
  public countryCode: Array<Select2OptionData>;

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private commonService: CommonHttpService, private alert: AlertService, private loader: LoaderService, private router: Router, private formBuilder: FormBuilder, private modalService: NgbModal, private pushNotification: PushNotificationService) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("User Otp", "user otp", "otp", event.urlAfterRedirects, 16);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
    this.ok = this.language.ok;
    this.edit = this.language.edit;

    this.getCountryList();
    this.userData = this.commonService.getUserData();

    if (this.userData == null || this.userData == "" && this.userData.is_phone_verified == 0) {
      this.router.navigate(["signup"]);
    }
    this.countryCodeChanged(this.userData.country_code);

  }


  formBuild() {
    this.otpForm = this.formBuilder.group({
      country_code: ['', [Validators.required]],
      phone_number: ['', [Validators.required, Validators.pattern(/^(\d{9,15}|)$/)]],
      otp: ['', [Validators.required, Validators.pattern(/^(\d{4,4}|)$/)]],
    })
  }

  setValue() {
    this.otpForm.patchValue({
      phone_number: this.userData.phone_number,
      country_code: this.userData.country_code
    })
  }

  get f() {
    return this.otpForm.controls;
  }

  countryCodeChanged(val) {
    this.selectCountryCode = val.country_code;
  }


  getCountryList() {
    this.loader.display(true);
    const url = "countrylist";
    this.commonService.commonGetCall(url).subscribe(data => {
      this.loader.display(false);
      this.countryCode = [...data.data.list];
    }, error => {
      this.loader.display(false);
    });
  }

  ngOnInit() {
    this.pushNotification.requestPermission();
    this.configCountryCode = this.commonService.setOptions("country_code");
    this.formBuild();
    this.setValue();
  }

  checkOtp(content) {
    this.submitted = true;
    if (this.otpForm.invalid) {
      return;
    }
    this.loader.display(true);
    const reqData = this.otpForm.value;
    const url = "verifyotp";
    this.commonService.commonPostCall(url, reqData).subscribe(data => {
      if (data.status == 200) {
        this.alert.success(data.message);
        const users = data.data;
        this.userData['OTP'] = ""
        this.submitted = false;
        console.log(users)
        this.commonService.shareUserData(users);
        this.commonService.setUserData(JSON.stringify(users));
        this.openVerticallyCentered(content)
        this.sendToken();
        this.setValue();
        //this.open(content);
      } else {
        this.alert.info(data.message);
      }
      this.loader.display(false);

    }, error => {
      if (error.error && error.error.status == 400) {
        this.alert.info(error.error.message);
        // this.open(content);
      } else if (typeof error == 'string') {
        this.alert.info(error)
      }
      this.loader.display(false);
    })
  }
  verifiedOtp() {
    this.router.navigate(["home"]);
  }

  sendToken() {
    const url = 'updatedevicetoken';
    this.pushNotification.requestPermission().subscribe(token => {
      alert(token)
      const data = { device_token: token };
      this.commonService.commonPostCall(url, data).subscribe(data => {
      })
    }, error => {

    });

  }


  editPhoneNo() {
    this.isDisabled = this.isDisabled == true ? false : true;
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

  resendOtp() {
    this.resendSubmitted = true;
    if (!this.otpForm.value.country_code && !this.otpForm.value.phone_number) {
      return;
    }
    this.loader.display(true);
    const reqData = { country_code: this.otpForm.value.country_code, phone_number: this.otpForm.value.phone_number }
    const url = "resendotp";
    this.commonService.commonPostCall(url, reqData).subscribe(data => {
      if (data.status == 200) {
        this.alert.success(data.message);
        this.userData['OTP'] = data.OTP;
        this.userData['country_code'] = this.otpForm.value.country_code;
        this.userData['phone_number'] = this.otpForm.value.phone_number;
        this.commonService.setUserData(JSON.stringify(this.userData));
        this.setValue();
      } else if (data.status == 400) {
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
      this.loader.display(false);
    })

  }

}
